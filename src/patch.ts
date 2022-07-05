const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;
let keys: string[] = ['id'];

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

    //@ts-ignore
    keys = options.keys

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

    return patchElement(root as HTMLElement, to as HTMLElement)
}

export function patchElement(root: HTMLElement, to: HTMLElement): HTMLElement {
    // Inputs, textareas, and templates are special cases.
    // Inputs and textareas because of IDL attributes not being compared correctly
    // Templates because nested templates are not supported
    if (root.isEqualNode(to)) {
        let name = root.nodeName
        if (name !== 'INPUT' && name !== 'TEXTAREA' && name !== 'TEMPLATE') {
            if (root.querySelector('input, textarea, template') === null) {
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
            for (let key of keys) {
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
                a = patchElement(a as HTMLElement, b as HTMLElement) as Node
            }
        }

        a = patchNode(a, aNodeType, b, bNodeType)
    }

    return root
}

function patchNode(a: Node, aNodeType: number, b: Node, bNodeType: number): Node {
    // You might be wondering why we're including the nodeType here.
    // It's much faster to not read from it unnecessarily
    let aNodeName = a.nodeName

    if (a.isEqualNode(b)) {
        if (aNodeName !== 'INPUT' && aNodeName !== 'TEXTAREA' && aNodeName !== 'TEMPLATE') {
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

        // I realize this code is hideous. I'm sorry. It compiles out.
        if (aNodeName === 'INPUT') {
            if ((a as HTMLInputElement).value !== (b as HTMLInputElement).value) {
                (a as HTMLInputElement).value = (b as HTMLInputElement).value
            }
            if ((a as HTMLInputElement).checked !== (b as HTMLInputElement).checked) {
                (a as HTMLInputElement).checked = (b as HTMLInputElement).checked
                if ((a as HTMLInputElement).checked) {
                    (a as HTMLInputElement).setAttribute('checked', '');
                    (b as HTMLInputElement).setAttribute('checked', '')
                }
            }
            if ((a as HTMLInputElement).disabled !== (b as HTMLInputElement).disabled) {
                (a as HTMLInputElement).disabled = (b as HTMLInputElement).disabled
                if ((a as HTMLInputElement).disabled) {
                    (a as HTMLInputElement).setAttribute('disabled', '');
                    (b as HTMLInputElement).setAttribute('disabled', '')
                }
            }
        }

        if (aNodeName === 'TEXTAREA') {
            if ((a as HTMLTextAreaElement).value !== (b as HTMLTextAreaElement).value) {
                (a as HTMLTextAreaElement).value = (b as HTMLTextAreaElement).value
            }
            if ((a as HTMLTextAreaElement).disabled !== (b as HTMLTextAreaElement).disabled) {
                (a as HTMLTextAreaElement).disabled = (b as HTMLTextAreaElement).disabled
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

    // @TODO: Can we get rid of the clone node ?
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
            // This is inspired by Laravel Livewire's ability to update attributes
            // without encountering InvalidCharacterError's when using the `@` symbol.
            // Specifically for Alpine / Petite-Vue bindings.
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
