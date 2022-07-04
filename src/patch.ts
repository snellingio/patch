const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;

type PatchOptions = {
    keys: string[],
    childrenOnly: boolean
}

export function el(s: string): HTMLElement {
    return document.createRange().createContextualFragment(s.trim()).firstChild as HTMLElement
}

export default function patch(
    root: HTMLElement | Node,
    to: HTMLElement | Node | string,
    options: Partial<PatchOptions> = {},
): HTMLElement | Node | null {
    options = Object.assign({
        keys: ['id'],
        childrenOnly: false,
    }, options) as PatchOptions

    let rootNodeType = root.nodeType

    if (rootNodeType === DOCUMENT_FRAGMENT_NODE) {
        if (root.firstChild) {
            root = root.firstChild
        }
    }

    if (typeof to === 'string') {
        let html
        switch (root.nodeName) {
            case '#document':
            case 'HTML':
                html = to
                to = document.createElement('html');
                (to as HTMLElement).innerHTML = html
                break
            case 'BODY':
                html = to
                to = document.createElement('body');
                (to as HTMLElement).innerHTML = html
                break
            default:
                to = el(to)
        }
    }

    let toNodeType = to.nodeType

    if (toNodeType === DOCUMENT_FRAGMENT_NODE) {
        to = (to as HTMLElement).firstElementChild as HTMLElement
        toNodeType = to.nodeType
    }

    if (!options.childrenOnly) {
        root = patchNode(root, rootNodeType, to, toNodeType) as HTMLElement
    }

    return patchElement(root as HTMLElement, to as HTMLElement, options)
}

export function patchElement(root: HTMLElement, to: HTMLElement, options: Partial<PatchOptions> = {}): HTMLElement {
    if (root.isEqualNode(to)) {
        let name = root.nodeName
        if (name !== 'INPUT' && name !== 'TEXTAREA') {
            if (root.querySelector('input, textarea') === null) {
                return root
            }
        }
    }

    if (!root.hasChildNodes()) {
        return root
    }

    main: for (let index = 0, offset = 0; ; index++) {
        let a: Node = root.childNodes[index]
        let b: Node = to.childNodes[index - offset]

        if (!a && !b) {
            break
        }

        if (!b) {
            root.removeChild(a)
            index--
            continue
        }

        if (!a) {
            root.appendChild(b)
            offset++
            continue
        }

        let aNodeType = a.nodeType
        let bNodeType = b.nodeType
        let aIsElement = aNodeType === ELEMENT_NODE
        let bIsElement = bNodeType === ELEMENT_NODE

        if (!aIsElement && !bIsElement) {
            a.nodeValue = b.nodeValue
            continue
        }

        if (aIsElement || bIsElement) {
            // @ts-ignore
            for (let key of ['id']) {
                let aValue = aIsElement ? (a as HTMLElement).getAttribute(key) : null
                let bValue = bIsElement ? (b as HTMLElement).getAttribute(key) : null

                if (aValue !== bValue) {
                    if (aValue && bValue) {
                        let node = root.querySelector(`[${key}="${bValue}"]`) //

                        if (!node) {
                            if (a.nextSibling) {
                                a.parentNode?.insertBefore(b, a)
                                offset++
                                continue main
                            } else {
                                root.replaceChild(b, a)
                                index--
                                continue main
                            }
                        } else {
                            a = root.insertBefore(node, a);
                        }
                    }

                    if (aValue && !bValue) {
                        let node = root.querySelector(`[${key}="${aValue}"]`)

                        if (!node && aIsElement) {
                            (a as HTMLElement).remove()
                            offset++
                            continue main
                        }

                        if (bIsElement) {
                            a.parentNode?.insertBefore(b, a.nextSibling)
                            offset++
                            continue main
                        }
                    }
                }
            }

            if (a.hasChildNodes()) {
                a = patchElement(a as HTMLElement, b as HTMLElement, options) as Node
            }
        }

        a = patchNode(a, aNodeType, b, bNodeType)
    }

    return root
}

function patchNode(a: Node, aNodeType: number, b: Node, bNodeType: number): Node {
    let aNodeName = a.nodeName

    if (a.isEqualNode(b)) {
        if (aNodeName !== 'INPUT' && aNodeName !== 'TEXTAREA') {
            return a
        }
    }

    if (aNodeType === ELEMENT_NODE && bNodeType === ELEMENT_NODE) {
        if (aNodeName !== b.nodeName) {
            let tag = document.createElement((b as HTMLElement).tagName)
            tag.innerHTML = (a as HTMLElement).innerHTML;
            a.parentElement?.replaceChild(tag, a)
            a = tag
        }

        if (aNodeName === 'INPUT') {
            if (a.value !== b.value) {
                a.value = b.value
            }
            if (a.checked !== b.checked) {
                a.checked = b.checked
                if (a.checked) {
                    a.setAttribute('checked', '')
                    b.setAttribute('checked', '')
                }
            }
            if (a.disabled !== b.disabled) {
                a.disabled = b.disabled
                if (a.disabled) {
                    a.setAttribute('disabled', '')
                    b.setAttribute('disabled', '')
                }
            }
        }

        if (aNodeName === 'TEXTAREA') {
            if (a.value !== b.value) {
                a.value = b.value
            }
            if (a.disabled !== b.disabled) {
                a.disabled = b.disabled
            }
        }

        a = patchElementAttributes((a as HTMLElement), (b as HTMLElement))

        if (!a.hasChildNodes()) {
            (a as HTMLElement).innerHTML = (b as HTMLElement).innerHTML
        }

        return a
    }

    if (bNodeType === COMMENT_NODE) {
        const comment = document.createComment(b.nodeValue ?? '')
        a.parentNode?.insertBefore(comment, a)
        return comment
    }

    if (bNodeType === TEXT_NODE) {
        const text = document.createTextNode(b.nodeValue ?? '')
        a.parentNode?.insertBefore(text, a)
        return text
    }

    a.parentNode?.replaceChild(b.cloneNode(true), a)
    return a
}

function patchElementAttributes(a: HTMLElement, b: HTMLElement): HTMLElement {
    let attributes = a.attributes
    let bAttributes = b.attributes
    let aLength = attributes.length
    let bLength = bAttributes.length

    for (let i = aLength - 1; i >= 0; i--) {
        const name = attributes[i].name

        if (!b.hasAttribute(name)) {
            a.removeAttribute(name)
        }
    }

    for (let i = 0; i < bLength; i++) {
        const name = bAttributes[i].name
        const value = bAttributes[i].value

        if (a.getAttribute(name) !== value) {
            try {
                Element.prototype.setAttribute.call(a, name, value)
            } catch (e) {
                let host = document.createElement('div')
                host.innerHTML = `<span ${name}="${value}"></span>`
                let node = host.firstElementChild as HTMLElement
                let attr = node.getAttributeNode(name) as Attr
                node.removeAttributeNode(attr)
                a.setAttributeNode(attr)
            }
        }
    }

    return a
}
