import {expect, it} from 'vitest'
import patch from '../src/patch'


/**
 * This is mostly a copy/paste of the morphdom library.
 * https://github.com/patrick-steele-idem/morphdom/blob/master/test/browser/test.js#L350
 *
 * Yes, it has been modified. Yes, some tests have been completely removed as our API is different.
 */


it('should transform a simple el', function () {
    let el1 = document.createElement('div')
    el1.className = 'foo'

    let el2 = document.createElement('div')
    el2.className = 'bar'

    patch(el1, el2)

    expect(el1.className).to.equal('bar')
})

it('can wipe out body', function () {
    let el1 = document.createElement('body')
    let div = document.createElement('div')
    el1.appendChild(div)

    patch(el1, '<body></body>')

    expect(el1.nodeName).to.equal('BODY')
    expect(el1.children.length).to.equal(0)
})

it('does morph child with dup id', function () {
    let el1 = document.createElement('div')
    el1.id = 'el-1'
    el1.innerHTML = '<div id="el-1">A</dib>'
    el1.className = 'foo'

    let el2 = document.createElement('div')
    el2.id = 'el-1'
    el2.innerHTML = '<div id="el-1">B</dib>'
    el2.className = 'bar'

    patch(el1, el2)

    expect(el1.className).to.equal('bar')
    expect(el1.id).to.equal('el-1')
    expect(el1?.firstElementChild?.id).to.equal('el-1')
    expect(el1?.firstElementChild?.textContent).to.equal('B')
})

it('nested duplicate ids are morphed correctly', function () {
    let el1 = document.createElement('div')
    el1.innerHTML = '<p id="hi" class="foo">A</p><p id="hi" class="bar">B</p>'

    let el2 = document.createElement('div')
    el2.innerHTML = '<p id="hi" class="foo">A</p>'

    patch(el1, el2)

    expect(el1.children.length).to.equal(1)
    expect(el1.children[0].id).to.equal('hi')
    expect(el1.children[0].className).to.equal('foo')
    expect(el1.children[0].textContent).to.equal('A')
})

it('should transform a text input el', function () {
    let el1 = document.createElement('input')
    el1.type = 'text'
    el1.value = 'Hello World'

    let el2 = document.createElement('input')
    el2.setAttribute('type', 'text')
    el2.setAttribute('value', 'Hello World 2')

    patch(el1, el2)

    expect(el1.value).to.equal('Hello World 2')
})

it('should transform a checkbox input attribute', function () {
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.setAttribute('checked', '')
    el1.checked = false

    let el2 = document.createElement('input')
    el2.setAttribute('type', 'text')
    el2.setAttribute('checked', '')

    patch(el1, el2)

    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('text')
})

it('should transform a checkbox input property', function () {
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.checked = false

    let el2 = document.createElement('input')
    el2.type = 'checkbox'
    el2.checked = true

    patch(el1, el2)

    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('checkbox')
})

it('should transform a checkbox input property with container', function() {
    let div1 = document.createElement('div')
    let el1 = document.createElement('input')
    el1.id = 'meade'
    el1.type = 'checkbox'
    el1.checked = true
    div1.appendChild(el1)

    let div2 = document.createElement('div')
    let el2 = document.createElement('input')
    el2.id = 'meade'
    el2.type = 'checkbox'
    el2.checked = false
    div2.appendChild(el2)

    patch(div1, div2.outerHTML)

    expect(div1.firstChild.getAttribute('checked')).to.equal(null)
    expect(div1.firstChild.checked).to.equal(false)
})

it('checkbox outputs getAttribute correctly', function () {
    let input = document.createElement('template')
    input.innerHTML = '<div id="phx-FfHldq3JexivVQLC" class="phx-disconnected"><form phx-change="change" phx-submit="submit"><label>check me<input type="checkbox" value="true" checked="true" name="check1"><input type="checkbox" value="true" name="check2"></label><button type="submit">Invert</button></form></div>'
    let output = document.createElement('template')
    output.innerHTML = '<div id="phx-FfHldq3JexivVQLC" class="phx-connected"><form phx-change="change" phx-submit="submit"><label>check me<input type="checkbox" value="true" name="check1"><input type="checkbox" value="true" name="check2"></label><button type="submit">Invert</button></form></div>'

    let res = patch(input.content.firstChild, output.content.firstChild) as HTMLElement

    expect(res.querySelector('[name="check1"]').getAttribute('checked')).to.equal(null)
    expect(res.querySelector('[name="check2"]').getAttribute('checked')).to.equal(null)
})

it('should transform a checkbox input attribute as string when no checked attribute nor property', function() {
    let el1 = document.createElement('input')
    el1.type = 'checkbox'

    let el2 = '<input type="checkbox" checked="" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal('')
    expect(el1.checked).to.equal(true)
})

it('should transform a checkbox input property as string', function() {
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.setAttribute('checked', '')
    el1.checked = true

    let el2 = '<input type="checkbox" checked="" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal('')
    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('checkbox')
})

it('should transform a checkbox input property as string with no checked attribute', function() {
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.checked = true

    let el2 = '<input type="checkbox" checked="" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal('')
    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('checkbox')
})

it('should transform a checkbox input property as string when target has no checked state', function() {
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.setAttribute('checked', '')
    el1.checked = true

    let el2 = '<input type="checkbox" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal(null)
    expect(el1.checked).to.equal(false)
    expect(el1.type).to.equal('checkbox')
})

it('should transform a checkbox input property to checked as string when container', function() {
    let div1 = document.createElement('div')
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.id = 'foo'
    el1.setAttribute('checked', '')
    el1.checked = true
    div1.appendChild(el1)

    let div2 = '<div><input id="foo" type="checkbox" /></div>'

    patch(div1, div2)

    expect(div1.firstChild.type).to.equal('checkbox')
    expect(div1.firstChild.getAttribute('checked')).to.equal(null)
    expect(div1.firstChild.checked).to.equal(false)
})

it('should transform a checkbox input property to checked as string with name attribute when container', function() {
    let div1 = document.createElement('div')
    let el1 = document.createElement('input')
    el1.type = 'checkbox'
    el1.name = 'foo'
    el1.setAttribute('checked', '')
    el1.checked = true
    div1.appendChild(el1)

    let div2 = '<div><input name="foo" type="checkbox" /></div>'

    patch(div1, div2)

    expect(div1.firstChild.type).to.equal('checkbox')
    expect(div1.firstChild.getAttribute('checked')).to.equal(null)
    expect(div1.firstChild.checked).to.equal(false)
})

it('should transform a radio input attribute', function() {
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.setAttribute('checked', '')
    el1.checked = false

    let el2 = document.createElement('input')
    el2.setAttribute('type', 'radio')
    el2.setAttribute('checked', '')

    patch(el1, el2)

    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('radio')
})

it('should transform a radio input attribute as string', function() {
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.checked = false

    let el2 = '<input type="radio" checked="" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal('')
    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('radio')
})

it('should transform a radio input property as string', function() {
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.setAttribute('checked', '')
    el1.checked = true

    let el2 = '<input type="radio" checked="" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal('')
    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('radio')
})

it('should transform a radio input property as string when not checked by default', function() {
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.setAttribute('checked', '')
    el1.checked = true

    let el2 = '<input type="radio" />'

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal(null)
    expect(el1.checked).to.equal(false)
    expect(el1.type).to.equal('radio')
})

it('should transform a radio input property to checked as string when container', function() {
    let div1 = document.createElement('div')
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.id = 'foo'
    el1.setAttribute('checked', '')
    el1.checked = true
    div1.appendChild(el1)

    let div2 = '<div><input id="foo" type="radio" /></div>'

    patch(div1, div2)

    expect(div1.firstChild.type).to.equal('radio')
    expect(div1.firstChild.getAttribute('checked')).to.equal(null)
    expect(div1.firstChild.checked).to.equal(false)
})

it('should transform a radio input property to checked as string with name attribute when container', function() {
    let div1 = document.createElement('div')
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.name = 'foo'
    el1.setAttribute('checked', '')
    el1.checked = true
    div1.appendChild(el1)

    let div2 = '<div><input name="foo" type="radio" /></div>'

    patch(div1, div2)

    expect(div1.firstChild.type).to.equal('radio')
    expect(div1.firstChild.getAttribute('checked')).to.equal(null)
    expect(div1.firstChild.checked).to.equal(false)
})

it('should transform a radio input property as HTMLElements', function() {
    let el1 = document.createElement('input')
    el1.type = 'radio'
    el1.checked = false

    let el2 = document.createElement('input')
    el2.type = 'radio'
    el2.checked = true

    patch(el1, el2)

    expect(el1.getAttribute('checked')).to.equal('')
    expect(el1.checked).to.equal(true)
    expect(el1.type).to.equal('radio')
})

it('should transform a radio input property with container as HTMLElements', function() {
    let div1 = document.createElement('div')
    let el1 = document.createElement('input')
    el1.id = 'meade'
    el1.type = 'radio'
    el1.checked = true
    div1.appendChild(el1)

    let div2 = document.createElement('div')
    let el2 = document.createElement('input')
    el2.id = 'meade'
    el2.type = 'radio'
    el2.checked = true
    div2.appendChild(el2)

    patch(div1, div2.outerHTML)

    expect(div1.firstChild.getAttribute('checked')).to.equal(null)
    expect(div1.firstChild.checked).to.equal(false)
})

it('should transform an incompatible node and maintain the same parent', function() {
    let parentEl = document.createElement('div')


    let el1 = document.createElement('input')
    el1.type = 'text'
    el1.value = 'Hello World'
    parentEl.appendChild(el1)

    let el2 = document.createElement('p')
    let morphedNode = patch(el1, el2)

    expect(morphedNode.parentNode).to.equal(parentEl)
})

it('should handle the "disabled" attribute correctly', function() {
    let el1 = document.createElement('input')
    el1.disabled = true

    el1.value = 'Hello World'

    let el2 = document.createElement('input')
    el2.setAttribute('value', 'Hello World 2')

    patch(el1, el2)

    expect(el2.disabled).to.equal(false)
})

it('should transform a simple el to a target HTML string', function() {
    let el1 = document.createElement('div')
    el1.innerHTML  = '<button>Click Me</button>'

    patch(el1, '<div class="bar"><button>Click Me</button>')

    expect(el1.className).to.equal('bar')
    expect(el1.firstChild.nodeName).to.equal('BUTTON')
    expect(el1.firstChild.textContent).to.equal('Click Me')
})

it('should transform a simple el to a target HTML string with ignore spaces', function() {
    let el1 = document.createElement('div')
    el1.innerHTML  = '<button>Click Me</button>'

    patch(el1, ' <div class="bar"><button>Click Me</button>')

    expect(el1.className).to.equal('bar')
    expect(el1.firstChild.nodeName).to.equal('BUTTON')
    expect(el1.firstChild.textContent).to.equal('Click Me')
})

it('should transform a textarea el', function() {
    let el1 = document.createElement('div')
    el1.innerHTML = '<textarea>foo</textarea>'
    el1.firstChild.value = 'foo2'

    let el2 = document.createElement('div')
    el2.innerHTML = '<textarea>bar</textarea>'

    expect(el1.firstChild.value).to.equal('foo2')
    expect(el1.firstChild.innerHTML).to.equal('foo')

    patch(el1, el2)

    expect(el1.firstChild.value).to.equal('bar')
    expect(el1.firstChild.innerHTML).to.equal('bar')
})

it('should preserve placeholder in an empty textarea el', function() {
    let el1 = document.createElement('div')
    el1.innerHTML = '<textarea placeholder="foo"></textarea>'
    let textarea1 = el1.firstChild

    // Special test for IE behavior.
    if (textarea1.firstChild && textarea1.firstChild.nodeValue === 'foo') {
        let el2 = document.createElement('div')
        el2.innerHTML = '<textarea placeholder="foo"></textarea>'

        patch(el1, el2)

        expect(textarea1.firstChild.nodeValue).to.equal('foo')
    }
})

it('should not change caret position if input value did not change', function() {
    let inputEl = document.createElement('input')
    inputEl.type = 'text'
    inputEl.value = 'HELLO'
    inputEl.id = 'focusInput'
    document.body.appendChild(inputEl)

    inputEl.focus()

    inputEl.setSelectionRange(0, 0)
    expect(inputEl.selectionStart).to.equal(0)

    function update() {
        let newInput = document.createElement('input')
        newInput.type = 'text'
        newInput.id = 'focusInput'
        newInput.value = inputEl.value
        patch(inputEl, newInput)
    }

    inputEl.addEventListener('input', update)

    update()

    expect(inputEl.selectionStart).to.equal(0)
})

it('should determine correct matching elements by id', function() {
    let el1 = document.createElement('div')
    el1.innerHTML = '<span id="span1"></span><span id="span2"></span>'

    let el2 = document.createElement('div')
    el2.innerHTML = '<span id="span2"></span>'

    let span2 = el1.children[1]

    let res = patch(el1, el2) as HTMLElement

    console.log(res.outerHTML)

    expect(res.children[0]).to.equal(span2)
    expect(res.children.length).to.equal(1)
})

it('should reuse DOM element with matching ID and class name', function() {
    let fromEl = document.createElement('p')
    let toEl = document.createElement('p')

    fromEl.innerHTML = '<div id="qwerty" class="div1"></div>'
    toEl.innerHTML = '<span><div id="qwerty" class="div1"></div></span>'

    let div1a = fromEl.querySelector('.div1')

    patch(fromEl, toEl)

    let div1b = fromEl.querySelector('.div1')

    expect(div1a).to.equal(div1b)
})

it('should transform an html document el to a target HTML string', function() {
    let el1 = document.createElement('html')
    el1.innerHTML = '<html><head><title>Test</title></head><body>a</body></html>'

    expect(el1.firstChild.nextSibling.innerHTML).to.equal('a')

    patch(el1, '<html><head><title>Test</title></head><body>b</body></html>')

    expect(el1.nodeName).to.equal('HTML')
    expect(el1.firstChild.nodeName).to.equal('HEAD')
    expect(el1.firstChild.nextSibling.nodeName).to.equal('BODY')
    expect(el1.firstChild.nextSibling.innerHTML).to.equal('b')
})

it('patch tags by id', function() {
    let el1 = document.createElement('div')
    el1.innerHTML = '<span id="boo" class="foo"></span>'

    let el2 = document.createElement('div')
    el2.innerHTML = '<div id="boo"></div>'

    let finalEl = patch(el1, el2)

    expect(finalEl.innerHTML).to.equal('<div id="boo"></div>')
})


it('handles web components', function () {
    class Form extends HTMLElement {
        constructor() {
            super()

            let form = document.createElement('form')
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.id = 'element-to-be-removed'
            form.appendChild(input)
            this.appendChild(form)
        }
    }

    window.customElements.define('my-form', Form)
    let html = '<my-form></my-form>'
    let container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = html

    let res = patch(
        container,
        '<div id="root"><form><p>Element to keep in dom</p></form></div>',
        { childrenOnly: true }
    ) as HTMLElement

    expect(res.querySelector('input') === null).to.equal(true)
})

it('handles web components as both from and to', function () {
    class FirstForm extends HTMLElement {
        constructor() {
            super()

            let form = document.createElement('form')
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.id = 'element-to-be-replaced'
            form.appendChild(input)
            this.appendChild(form)
        }
    }

    window.customElements.define('first-form', FirstForm)
    let html = '<first-form></first-form>'
    let container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = html

    class SecondForm extends HTMLElement {
        constructor() {
            super()

            let form = document.createElement('form')
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.id = 'second-element-input'
            form.appendChild(input)
            this.appendChild(form)
        }
    }

    window.customElements.define('second-form', SecondForm)
    let secondHtml = '<second-form></second-form>'
    let secondContainer = document.createElement('div')
    secondContainer.id = 'root'
    secondContainer.innerHTML = secondHtml

    let res = patch(
        container,
        secondContainer.cloneNode(true),
        { childrenOnly: true }
    ) as HTMLElement

    expect(res.querySelector('input').id).to.equal('second-element-input')
})

it('handles web components when both are the same', function () {
    let connectedCallbackCount = 0
    let disconnectedCallbackCount = 0
    class YinzForm extends HTMLElement {
        constructor() {
            super()

            let form = document.createElement('form')
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.id = 'element-to-be-replaced'
            form.appendChild(input)
            this.appendChild(form)
        }
    }

    window.customElements.define('yinz-form', YinzForm)
    let html = '<yinz-form></yinz-form>'
    let container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = html

    let res = patch(
        container,
        container.outerHTML,
        {
            childrenOnly: true,
        }
    ) as HTMLElement

    expect(res.querySelector('input').id).to.equal('element-to-be-replaced')
    expect(res.isSameNode(container)).to.equal(true)
    expect(res.isEqualNode(container)).to.equal(true)
})

it('does partially handle web components with attached shadow root', function () {
    class OtherForm extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({ mode: 'open' })
            let form = document.createElement('form')
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.id = 'element-to-be-removed'
            form.appendChild(input)
            this.shadowRoot.append(form)
        }
    }

    window.customElements.define('other-form', OtherForm)
    let html = '<other-form></other-form>'
    let container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = html

    class ZooForm extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({ mode: 'open' })
            let form = document.createElement('form')
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.id = 'second-to-be-replaced'
            form.appendChild(input)
            this.shadowRoot.append(form)
        }
    }

    window.customElements.define('zoo-form', ZooForm)
    let zooHtml = '<zoo-form></zoo-form>'
    let zooContainer = document.createElement('div')
    zooContainer.id = 'root'
    zooContainer.innerHTML = zooHtml

    let res = patch(
        container,
        zooContainer,
        { childrenOnly: true }
    ) as HTMLElement

    expect(res.querySelector('zoo-form').toString()).to.be.ok
    // THIS IS A NECESSARY CONSEQUENCE OF NO STRING REPRESENTATION OF TOEL
    expect(res.querySelector('input') === null).to.equal(true)
})

it('should handle document fragment removal', function () {
    let element = document.createElement('div')
    element.innerHTML = '<span>Hello</span>'

    // Build the fragment to match the children.
    let fragment = document.createDocumentFragment()
    let span = document.createElement('span')
    span.appendChild(document.createTextNode('World'))
    fragment.appendChild(span)

    let res = patch(element, fragment) as HTMLElement

    expect(res?.nodeName).to.equal('SPAN')
    expect(res?.textContent).to.equal('World')
})

it('should handle document fragment as target', function () {
    // Build the fragment to match the children.
    let spanish = document.createDocumentFragment()
    spanish.appendChild(document.createElement('div'))
    spanish.firstChild.appendChild(document.createTextNode('Ola'))

    let english = document.createDocumentFragment()
    let div = document.createElement('div')
    let span = document.createElement('span')
    span.appendChild(document.createTextNode('Hello'))
    div.appendChild(span)
    english.appendChild(div)

    let res = patch(spanish, english) as HTMLElement

    expect(res.firstElementChild.nodeName).to.equal('SPAN')
    expect(res.firstElementChild.textContent).to.equal('Hello')
})

it('multiple forms and adding additional form', function () {
    // Build the fragment to match the children.
    let english = document.createElement('template')
    english.innerHTML = '<div><section id="list" phx-update="append"><article id="item-0"><form id="form-0" phx-submit="submit"><input type="hidden" name="id" value="0"><textarea name="text"></textarea><button type="submit">Submit</button></form></article><article id="item-1"><form id="form-1" phx-submit="submit"><input type="hidden" name="id" value="1"><textarea name="text">b</textarea><button type="submit">Submit</button></form></article></section></div>'
    let spanish = document.createElement('template')
    spanish.innerHTML = '<div><section id="list" phx-update="append"><article id="item-0"><form id="form-0" phx-submit="submit"><input type="hidden" name="id" value="0"><textarea name="text"></textarea><button type="submit">Submit</button></form></article><article id="item-1"><form id="form-1" phx-submit="submit"><input type="hidden" name="id" value="1"><textarea name="text">b</textarea><button type="submit">Submit</button></form></article><article id="item-2"><form id="form-2" phx-submit="submit"><input type="hidden" name="id" value="2"><textarea name="text"></textarea><button type="submit">Submit</button></form></article></section></div>'

    let res = patch(english.content.firstChild, spanish.content.firstChild)

    expect(res.querySelectorAll('#form-0').length).to.equal(1)
    expect(res.querySelectorAll('form').length).to.equal(3)
})

it('can work when container id changes', function () {
    let input = document.createElement('template')
    input.innerHTML = '<div id="foo"><div class="sds-field filter" id="make" data-phx-component="3"><label class="heading">Make</label><div class="sds-checkbox"><input class="sds-input" id="make_acura" name="makes[]" type="checkbox" value="acura"><label for="make_acura" class="sds-label">Acura</label></div><div class="sds-checkbox"><input class="sds-input" id="make_honda" name="makes[]" type="checkbox" value="honda"><label for="make_honda" class="sds-label">Honda</label></div><div class="sds-checkbox"><input class="sds-input" id="make_ram" name="makes[]" type="checkbox" value="ram"><label for="make_ram" class="sds-label">RAM</label></div><div class="sds-checkbox"><input class="sds-input" id="make_ford" name="makes[]" type="checkbox" value="ford"><label for="make_ford" class="sds-label">Ford</label></div></div></div>'
    let output = document.createElement('template')
    output.innerHTML = '<div id="bar"><div class="sds-field filter" id="make" data-phx-component="3"><label class="heading">Make</label><div class="sds-checkbox"><input class="sds-input" id="make_acura" name="makes[]" type="checkbox" value="acura"><label for="make_acura" class="sds-label">Acura</label></div><div class="sds-checkbox"><input class="sds-input" id="make_honda" name="makes[]" type="checkbox" value="honda"><label for="make_honda" class="sds-label">Honda</label></div><div class="sds-checkbox"><input class="sds-input" id="make_ram" name="makes[]" type="checkbox" value="ram"><label for="make_ram" class="sds-label">RAM</label></div><div class="sds-checkbox"><input class="sds-input" id="make_ford" name="makes[]" type="checkbox" value="ford"><label for="make_ford" class="sds-label">Ford</label></div></div></div>'

    let res = patch(input.content.firstChild, output.content.firstChild) as HTMLElement

    expect(res.id).to.equal('bar')
    expect(res.querySelectorAll('input').length).to.equal(4)
    expect(res.querySelectorAll('input').length).to.equal(4)
})

it('disabled works with multiple attributes/properties on element (need reverse for loop)', function () {
    let english = document.createElement('template')
    english.innerHTML = '<div><section id="list" phx-update="append"><article id="item-0"><form id="form-0" phx-submit="submit"><input type="hidden" name="id" value="0"><textarea name="text"></textarea><button type="submit" data-phx-disaabled disabled>Submit</button></form></article>'
    let spanish = document.createElement('template')
    spanish.innerHTML = '<div><section id="list" phx-update="append"><article id="item-0"><form id="form-0" phx-submit="submit"><input type="hidden" name="id" value="0"><textarea name="text"></textarea><button type="submit">Submit</button></form></article>'

    let res = patch(english.content.firstChild, spanish.content.firstChild) as HTMLElement

    expect(res.querySelector('button').disabled).to.equal(false)
})

it('handles SVG nodeName case mismatch', function () {
    let svgChildHTML = '<g transform="translate(50 100)" id="myid"><g transform="translate(0 0)"><text>hi</text></g></g>'
    let svgHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid meet">' +
        svgChildHTML +
        '</svg>'
    let svg = document.createElement('template')
    svg.innerHTML = svgHTML
    let res = patch(svg.content.firstChild.firstChild, svgChildHTML, {childrenOnly: false}) as HTMLElement

    expect(res.outerHTML).to.equal(svgChildHTML)
})

it('new id will not cause sibling-child keyed elements to be removed', function () {
    let div = document.createElement('div')
    div.id = 'root'
    div.innerHTML = `
         <div id="static">1</div>
         <div>sibling</div>
         <div>
             <div id="noupdate">
               <div id="child">child</div>
               <span>span</span>
             </div>
         </div>
       `
    let diffHTML = `
       <div id="root">
         <div id="static">2</div>
         <div id="sibling-now-has-id">sibling</div>
         <div>
             <div id="noupdate">
               <div id="child">child update</div>
               <span>span update</span>
             </div>
         </div>
       </div>
       `

    let res = patch(div, diffHTML) as HTMLElement

    // @TODO: add support for skipping elements
    expect(res.outerHTML.trim()).to.equal(`
       <div id="root">
         <div id="static">2</div>
         <div id="sibling-now-has-id">sibling</div>
         <div>
             <div id="noupdate">
               <div id="child">child update</div>
               <span>span update</span>
             </div>
         </div>
       </div>
       `.trim())
})

it.skip('should reuse DOM element with matching ID and class name (2)', function() {
    // NOTE: This test is currently failing. We need to improve the special case code
    //       for handling incompatible root nodes.
    let fromEl = document.createElement('div')
    let toEl = document.createElement('div')

    fromEl.innerHTML = '<div id="qwerty" class="div1"></div>'
    toEl.innerHTML = '<span><div id="qwerty" class="div1"></div></span>'

    fromEl = fromEl.firstChild
    toEl = toEl.firstChild

    let div1 = fromEl

    let res = patch(fromEl, toEl) as HTMLElement

    let div1_2 = res.querySelector('.div1')

    expect(div1).to.equal(div1_2)
})

