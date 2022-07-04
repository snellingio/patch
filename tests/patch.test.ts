// @ts-nocheck
import {describe, expect, it} from 'vitest';
import patch, {el} from '../src/patch';

describe('patch test suite', () => {

    it('should not do anything when elements are equal', () => {
        let a = el(`<p>Test</p>`)
        let b = el(`<p>Test</p>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should change the element tag', () => {
        let a = el(`<p>Test</p>`)
        let b = el(`<div>Test</div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should skip identical nested elements', () => {
        let a = el(`<div><p>Test</p></div>`)
        let b = el(`<div><p>Test</p></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should remove nested elements', () => {
        let a = el(`<div><p></p><p>Test</p><p></p></div>`)
        let b = el(`<div><p>Test</p></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should append nested elements', () => {
        let a = el(`<div><p>Test</p></div>`)
        let b = el(`<div><p></p><p>Test</p><p></p></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should skip identical comments', () => {
        let a = el(`<div><!-- comment --><p>Test</p></div>`)
        let b = el(`<div><!-- comment --><p>Test1</p></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should update comments', () => {
        let a = el(`<div><!-- comment --><p>Test</p></div>`)
        let b = el(`<div><!-- comment 2 --><p>Test</p></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should update text', () => {
        let a = el(`<div>Text<p>Test</p></div>`)
        let b = el(`<div>Text 2<p>Test</p></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should add attributes', () => {
        let a = el(`<div>Test</div>`)
        let b = el(`<div title="Title!">Test</div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should remove attributes', () => {
        let a = el(`<div title="Title!">Test</div>`)
        let b = el(`<div>Test</div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should update attributes', () => {
        let a = el(`<div title="Title!">Test</div>`)
        let b = el(`<div title="New Title!">Test</div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should remove namespaced attributes', () => {
        let a = el(`<div xmlns:special="http://www.mozilla.org/ns/specialspace" special:specialAlign="utterleft" title="#"></div>`)
        let b = el(`<div></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(`<div></div>`)
    })

    it('should add namespaced attributes', () => {
        let a = el(`<div></div>`)
        let b = el(`<div xmlns:special="http://www.mozilla.org/ns/specialspace" special:specialAlign="utterleft" title="#"></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(`<div xmlns:special="http://www.mozilla.org/ns/specialspace" special:specialalign="utterleft" title="#"></div>`)
    })

    it('should modify namespaced attributes', () => {
        let a = el(`<div xmlns:special="http://www.mozilla.org/ns/specialspace" special:specialAlign="utterleft"></div>`)
        let b = el(`<div xmlns:special="http://www.mozilla.org/ns/specialspace" special:specialAlign="utterright"></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(`<div xmlns:special="http://www.mozilla.org/ns/specialspace" special:specialalign="utterright"></div>`)
    })

    it('should update a namespaced attribute', () => {
        let a = el(`<svg viewBox="0 0 100 100"></svg>`)
        let b = el(`<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg"></svg>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should add classes', () => {
        let a = el(`<div></div>`)
        let b = el(`<div class="class class1 class2"></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should remove classes', () => {
        let a = el(`<div class="class class1 class2"></div>`)
        let b = el(`<div class="class1"></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should replace classes', () => {
        let a = el(`<div class="class class1"></div>`)
        let b = el(`<div class="class class2"></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should disable', () => {
        let a = el(`<input type="text" name="t">`)
        let b = el(`<input type="text" name="t" disabled>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res).toBeInstanceOf(HTMLInputElement)

        expect(res?.outerHTML).toEqual(`<input type="text" name="t" disabled="">`)
        expect(res?.disabled).toEqual(true)
    })

    it('should remove disabled', () => {
        let a = el(`<input type="text" name="t" disabled>`)
        let b = el(`<input type="text" name="t">`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
        expect(res?.disabled).toEqual(false)
    })

    it('should select', () => {
        let a = el(`<option value="t"></option>`)
        let b = el(`<option value="t" selected></option>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should unselect', () => {
        let a = el(`<option value="t" selected></option>`)
        let b = el(`<option value="t"></option>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should check', () => {
        let a = el(`<input type="checkbox" name="t">`)
        let b = el(`<input type="checkbox" name="t" checked>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
        expect(res?.checked).toEqual(true)
    })

    it('should uncheck', () => {
        let a = el(`<input type="checkbox" name="t" checked>`)
        let b = el(`<input type="checkbox" name="t">`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
        expect(res?.checked).toEqual(false)
    })

    it('should remove input value', () => {
        let a = el(`<input type="text" name="t" value="This is a journey into sound.">`)
        let b = el(`<input type="text" name="t">`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
        expect(res?.value).toEqual('')
    })

    it('should add input value', () => {
        let a = el(`<input type="text" name="t">`)
        let b = el(`<input type="text" name="t" value="This is a journey into sound.">`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
        expect(res?.value).toEqual('This is a journey into sound.')
    })

    it('should change input value', () => {
        let a = el(`<input type="text" name="t" value="A big brass band.">`)
        let b = el(`<input type="text" name="t" value="This is a journey into sound.">`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
        expect(res?.value).toEqual('This is a journey into sound.')
    })

    it('should add textarea value', () => {
        let a = el(`<textarea></textarea>`)
        let b = el(`<textarea>This is a journey into sound.</textarea>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should remove textarea value', () => {
        let a = el(`<textarea>This is a journey into sound.</textarea>`)
        let b = el(`<textarea></textarea>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should update textarea value', () => {
        let a = el(`<textarea>This is a journey into sound.</textarea>`)
        let b = el(`<textarea>No it's not</textarea>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should work with alpine events', () => {
        let a = el(`<button @click="doSomething()"></button>`)
        let b = el(`<button></button>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should work with alpine events', () => {
        let a = el(`<button x-on:click="doSomething()"></button>`)
        let b = el(`<button @click="doSomethingElse()"></button>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should work with alpine data', () => {
        let a = el(`<div></div>`)
        let b = el(`<div x-data="{ id: 0 }"></div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should patch innerHTML when childElementCount is 0', () => {
        let a = el(`<p>Test</p>`)
        let b = el(`<p>Wow</p>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('should update the position with an id', () => {
        let a = el(`<ul><li id="1">1</li><li id="2">2</li><li id="3">3</li></ul>`)
        let b = el(`<ul><li id="3">3</li><li id="2">2</li><li id="1">1</li></ul>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    });

    it('should update the position with an custom key', () => {
        let a = el(`<ul><li key="1">1</li><li key="2">2</li><li key="3">3</li></ul>`)
        let b = el(`<ul><li key="3">3</li><li key="2">2</li><li key="1">1</li></ul>`)

        let res = patch(a, b.cloneNode(true), {keys: ['id', 'key']}) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    });

    it('should update the position with an custom key malformed', () => {
        let a = el(`<ul>
<li key="1">1</li>
<li key="2">2</li>
<li key="3">3</li>
</ul>`)
        let b = el(`<ul>
<li key="3">Wow</li>
<li key="2">2</li>
<li key="1">One</li>
</ul>`)

        let res = patch(a, b.cloneNode(true), {keys: ['id', 'key']}) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    });

    it('should patch complex html', () => {
        let a = el(`<div>
    <figure class="bg-slate-100 rounded-xl p-8 dark:bg-slate-800">
        <img class="w-24 h-24 rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512" />
        <div class="pt-6 space-y-4">
            <blockquote>
                <p class="text-lg font-medium">
                    “Tailwind CSS is the only framework that I've seen scale
                    on large teams. It’s easy to customize, adapts to any design,
                    and the build size is tiny.”
                </p>
            </blockquote>
            <figcaption class="font-medium">
                <div class="text-sky-500 dark:text-sky-400">
                    Sarah Dayan
                </div>
                <div>
                    Staff Engineer, Algolia
                </div>
            </figcaption>
        </div>
    </figure>
</div>`)

        let b = el(`<div>
    <figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
        <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="400" height="600" />
        <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
            <blockquote>
                <span class="text-lg font-medium">
                    “Does anyone really like writing CSS?”
                </span>
            </blockquote>
            <figcaption class="font-medium">
                <div class="text-sky-500 dark:text-sky-400">
                    Sam Snelling
                </div>
                <cite class="text-slate-700 dark:text-slate-500">
                    Wuphf.com
                </cite>
            </figcaption>
        </div>
    </figure>
</div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)

    })
})

describe('morphdom test suite', () => {
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

    it('should transform a checkbox input property with container', function () {
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

        expect(div1.firstChild?.getAttribute('checked')).to.equal(null)
        expect(div1.firstChild?.checked).to.equal(false)
    })

    it('checkbox outputs getAttribute correctly', function () {
        let input = document.createElement('template')
        input.innerHTML = '<div id="phx-FfHldq3JexivVQLC" class="phx-disconnected"><form phx-change="change" phx-submit="submit"><label>check me<input type="checkbox" value="true" checked="true" name="check1"><input type="checkbox" value="true" name="check2"></label><button type="submit">Invert</button></form></div>'
        let output = document.createElement('template')
        output.innerHTML = '<div id="phx-FfHldq3JexivVQLC" class="phx-connected"><form phx-change="change" phx-submit="submit"><label>check me<input type="checkbox" value="true" name="check1"><input type="checkbox" value="true" name="check2"></label><button type="submit">Invert</button></form></div>'

        let res = patch(input.content.firstChild as HTMLElement, output.content.firstChild as HTMLElement) as HTMLElement

        expect(res.querySelector('[name="check1"]').getAttribute('checked')).to.equal(null)
        expect(res.querySelector('[name="check2"]').getAttribute('checked')).to.equal(null)
    })

    it('should transform a checkbox input attribute as string when no checked attribute nor property', function () {
        let el1 = document.createElement('input')
        el1.type = 'checkbox'

        let el2 = '<input type="checkbox" checked="" />'

        patch(el1, el2)

        expect(el1.getAttribute('checked')).to.equal('')
        expect(el1.checked).to.equal(true)
    })

    it('should transform a checkbox input property as string', function () {
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

    it('should transform a checkbox input property as string with no checked attribute', function () {
        let el1 = document.createElement('input')
        el1.type = 'checkbox'
        el1.checked = true

        let el2 = '<input type="checkbox" checked="" />'

        patch(el1, el2)

        expect(el1.getAttribute('checked')).to.equal('')
        expect(el1.checked).to.equal(true)
        expect(el1.type).to.equal('checkbox')
    })

    it('should transform a checkbox input property as string when target has no checked state', function () {
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

    it('should transform a checkbox input property to checked as string when container', function () {
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

    it('should transform a checkbox input property to checked as string with name attribute when container', function () {
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

    it('should transform a radio input attribute', function () {
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

    it('should transform a radio input attribute as string', function () {
        let el1 = document.createElement('input')
        el1.type = 'radio'
        el1.checked = false

        let el2 = '<input type="radio" checked="" />'

        patch(el1, el2)

        expect(el1.getAttribute('checked')).to.equal('')
        expect(el1.checked).to.equal(true)
        expect(el1.type).to.equal('radio')
    })

    it('should transform a radio input property as string', function () {
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

    it('should transform a radio input property as string when not checked by default', function () {
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

    it('should transform a radio input property to checked as string when container', function () {
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

    it('should transform a radio input property to checked as string with name attribute when container', function () {
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

    it('should transform a radio input property as HTMLElements', function () {
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

    it('should transform a radio input property with container as HTMLElements', function () {
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

    it('should transform an incompatible node and maintain the same parent', function () {
        let parentEl = document.createElement('div')

        let el1 = document.createElement('input')
        el1.type = 'text'
        el1.value = 'Hello World'
        parentEl.appendChild(el1)

        let el2 = document.createElement('p')
        let morphedNode = patch(el1, el2)

        expect(morphedNode.parentNode).to.equal(parentEl)
    })

    it('should handle the "disabled" attribute correctly', function () {
        let el1 = document.createElement('input')
        el1.disabled = true

        el1.value = 'Hello World'

        let el2 = document.createElement('input')
        el2.setAttribute('value', 'Hello World 2')

        patch(el1, el2)

        expect(el2.disabled).to.equal(false)
    })

    it('should transform a simple el to a target HTML string', function () {
        let el1 = document.createElement('div')
        el1.innerHTML = '<button>Click Me</button>'

        patch(el1, '<div class="bar"><button>Click Me</button>')

        expect(el1.className).to.equal('bar')
        expect(el1.firstChild.nodeName).to.equal('BUTTON')
        expect(el1.firstChild.textContent).to.equal('Click Me')
    })

    it('should transform a simple el to a target HTML string with ignore spaces', function () {
        let el1 = document.createElement('div')
        el1.innerHTML = '<button>Click Me</button>'

        patch(el1, ' <div class="bar"><button>Click Me</button>')

        expect(el1.className).to.equal('bar')
        expect(el1.firstChild.nodeName).to.equal('BUTTON')
        expect(el1.firstChild.textContent).to.equal('Click Me')
    })

    it('should transform a textarea el', function () {
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

    it('should preserve placeholder in an empty textarea el', function () {
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

    it('should not change caret position if input value did not change', function () {
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

    it('should determine correct matching elements by id', function () {
        let el1 = document.createElement('div')
        el1.innerHTML = '<span id="span1"></span><span id="span2"></span>'

        let el2 = document.createElement('div')
        el2.innerHTML = '<span id="span2"></span>'

        let span2 = el1.children[1]

        let res = patch(el1, el2) as HTMLElement

        expect(res.children[0]).to.equal(span2)
        expect(res.children.length).to.equal(1)
    })

    it('should reuse DOM element with matching ID and class name', function () {
        let fromEl = document.createElement('p')
        let toEl = document.createElement('p')

        fromEl.innerHTML = '<div id="qwerty" class="div1"></div>'
        toEl.innerHTML = '<span><div id="qwerty" class="div1"></div></span>'

        let div1a = fromEl.querySelector('.div1')

        patch(fromEl, toEl)

        let div1b = fromEl.querySelector('.div1')

        expect(div1a).to.equal(div1b)
    })

    it('should transform an html document el to a target HTML string', function () {
        let el1 = document.createElement('html')
        el1.innerHTML = '<html><head><title>Test</title></head><body>a</body></html>'

        expect(el1.firstChild.nextSibling.innerHTML).to.equal('a')

        patch(el1, '<html><head><title>Test</title></head><body>b</body></html>')

        expect(el1.nodeName).to.equal('HTML')
        expect(el1.firstChild.nodeName).to.equal('HEAD')
        expect(el1.firstChild.nextSibling.nodeName).to.equal('BODY')
        expect(el1.firstChild.nextSibling.innerHTML).to.equal('b')
    })

    it('patch tags by id', function () {
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
            {childrenOnly: true}
        ) as HTMLElement

        expect(res.querySelector('input') === null).to.equal(true)
    })

    // This totally works, but JSDOM does have a WC exception. [NotSupportedError: Unexpected child nodes.]
    it.skip('handles web components as both from and to', function () {
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
            {childrenOnly: true}
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
                this.attachShadow({mode: 'open'})
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
                this.attachShadow({mode: 'open'})
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
            {childrenOnly: true}
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
})

describe('morphdom benchmark fixtures', () => {

    /**
     * This is from morphdom's benchmark fixtures.
     *
     * https://github.com/patrick-steele-idem/morphdom/blob/master/test/fixtures/autotest/
     */

    it('attr-value-empty-string', () => {
        let a = el(`<input class="toggle" type="checkbox" checked="">`)
        let b = el(`<input class="toggle" type="checkbox" checked="" value="foo">`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('change-tagname-ids', () => {
        let a = el(`<p>
    <i id="w0">italics</i>
</p>`)
        let b = el(`<div>
    <i id="w0">italics</i>
</div>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('change-tagname', () => {
        let a = el(`<i>italics</i>`)
        let b = el(`<b>bold</b>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('table', () => {
        let a = el(`<table>
    <thead>
        <tr>
            <td></td>
            <td>
                virtual-dom
            </td>
            <td>
                morphdom
            </td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="test-name">
                change-tagname
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                change-tagname-ids
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-nested
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-nested-2
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.02ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-nested-3
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-nested-4
            </td>
            <td>
                0.11ms
            </td>
            <td>
                0.02ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-nested-5
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.02ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-nested-6
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                ids-prepend
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                input-element
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                input-element-disabled
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                input-element-enabled
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                large
            </td>
            <td>
                1.15ms
            </td>
            <td>
                2.42ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                lengthen
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.02ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                one
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                reverse
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                reverse-ids
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.03ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                select-element
            </td>
            <td>
                0.04ms
            </td>
            <td>
                0.36ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                shorten
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.02ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                simple
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.00ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                simple-ids
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.03ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                simple-text-el
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                svg
            </td>
            <td>
                0.01ms
            </td>
            <td>
                0.02ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                todomvc
            </td>
            <td>
                0.25ms
            </td>
            <td>
                0.50ms
            </td>
        </tr>
        <tr>
            <td class="test-name">
                two
            </td>
            <td>
                0.02ms
            </td>
            <td>
                0.01ms
            </td>
        </tr>
    </tbody>
</table>`)
        let b = el(`<table>
        <thead>
            <tr>
                <td></td>
                <td>
                    virtual-dom
                </td><td>
                    morphdom
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="test-name">
                    FOOBAR
                </td>
                <td>
                    888ms
                </td><td>
                    999ms
                </td>
            </tr><tr>
                <td class="test-name">
                    change-tagname-ids
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    data-table
                </td>
                <td>
                    0.30ms
                </td><td>
                    0.34ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-nested
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-nested-2
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-nested-3
                </td>
                <td>
                    0.16ms
                </td><td>
                    0.00ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-nested-4
                </td>
                <td>
                    0.18ms
                </td><td>
                    0.07ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-nested-5
                </td>
                <td>
                    0.03ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-nested-6
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    ids-prepend
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    input-element
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    input-element-disabled
                </td>
                <td>
                    0.00ms
                </td><td>
                    0.03ms
                </td>
            </tr><tr>
                <td class="test-name">
                    input-element-enabled
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    large
                </td>
                <td>
                    0.95ms
                </td><td>
                    1.53ms
                </td>
            </tr><tr>
                <td class="test-name">
                    lengthen
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.02ms
                </td>
            </tr><tr>
                <td class="test-name">
                    one
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.00ms
                </td>
            </tr><tr>
                <td class="test-name">
                    reverse
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.00ms
                </td>
            </tr><tr>
                <td class="test-name">
                    reverse-ids
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.01ms
                </td>
            </tr><tr>
                <td class="test-name">
                    select-element
                </td>
                <td>
                    0.03ms
                </td><td>
                    0.03ms
                </td>
            </tr><tr>
                <td class="test-name">
                    shorten
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.02ms
                </td>
            </tr><tr>
                <td class="test-name">
                    simple
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.00ms
                </td>
            </tr><tr>
                <td class="test-name">
                    simple-ids
                </td>
                <td>
                    0.03ms
                </td><td>
                    0.02ms
                </td>
            </tr><tr>
                <td class="test-name">
                    simple-text-el
                </td>
                <td>
                    0.02ms
                </td><td>
                    0.00ms
                </td>
            </tr><tr>
                <td class="test-name">
                    svg
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.14ms
                </td>
            </tr><tr>
                <td class="test-name">
                    todomvc
                </td>
                <td>
                    0.23ms
                </td><td>
                    0.30ms
                </td>
            </tr><tr>
                <td class="test-name">
                    two
                </td>
                <td>
                    0.01ms
                </td><td>
                    0.01ms
                </td>
            </tr>
        </tbody>
    </table>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })

    it('table-2', () => {
        var a = el(`<table id="example" class="display dataTable" cellspacing="0" width="100%" role="grid" aria-describedby="example_info" style="width: 100%;">
    <thead>
        <tr role="row">
            <th class="sorting_asc" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 137px;">Name</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending" style="width: 214px;">Position</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 103px;">Office</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 41px;">Age</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 92px;">Start date</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Salary: activate to sort column ascending" style="width: 80px;">Salary</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <th rowspan="1" colspan="1">Name</th>
            <th rowspan="1" colspan="1">Position</th>
            <th rowspan="1" colspan="1">Office</th>
            <th rowspan="1" colspan="1">Age</th>
            <th rowspan="1" colspan="1">Start date</th>
            <th rowspan="1" colspan="1">Salary</th>
        </tr>
    </tfoot>
    <tbody>
        <tr role="row" class="odd">
            <td class="sorting_1">Airi Satou</td>
            <td>Accountant</td>
            <td>Tokyo</td>
            <td>33</td>
            <td>2008/11/28</td>
            <td>$162,700</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Angelica Ramos</td>
            <td>Chief Executive Officer (CEO)</td>
            <td>London</td>
            <td>47</td>
            <td>2009/10/09</td>
            <td>$1,200,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Ashton Cox</td>
            <td>Junior Technical Author</td>
            <td>San Francisco</td>
            <td>66</td>
            <td>2009/01/12</td>
            <td>$86,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Bradley Greer</td>
            <td>Software Engineer</td>
            <td>London</td>
            <td>41</td>
            <td>2012/10/13</td>
            <td>$132,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Brenden Wagner</td>
            <td>Software Engineer</td>
            <td>San Francisco</td>
            <td>28</td>
            <td>2011/06/07</td>
            <td>$206,850</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Brielle Williamson</td>
            <td>Integration Specialist</td>
            <td>New York</td>
            <td>61</td>
            <td>2012/12/02</td>
            <td>$372,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Bruno Nash</td>
            <td>Software Engineer</td>
            <td>London</td>
            <td>38</td>
            <td>2011/05/03</td>
            <td>$163,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Caesar Vance</td>
            <td>Pre-Sales Support</td>
            <td>New York</td>
            <td>21</td>
            <td>2011/12/12</td>
            <td>$106,450</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Cara Stevens</td>
            <td>Sales Assistant</td>
            <td>New York</td>
            <td>46</td>
            <td>2011/12/06</td>
            <td>$145,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Cedric Kelly</td>
            <td>Senior Javascript Developer</td>
            <td>Edinburgh</td>
            <td>22</td>
            <td>2012/03/29</td>
            <td>$433,060</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Charde Marshall</td>
            <td>Regional Director</td>
            <td>San Francisco</td>
            <td>36</td>
            <td>2008/10/16</td>
            <td>$470,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Colleen Hurst</td>
            <td>Javascript Developer</td>
            <td>San Francisco</td>
            <td>39</td>
            <td>2009/09/15</td>
            <td>$205,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Dai Rios</td>
            <td>Personnel Lead</td>
            <td>Edinburgh</td>
            <td>35</td>
            <td>2012/09/26</td>
            <td>$217,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Donna Snider</td>
            <td>Customer Support</td>
            <td>New York</td>
            <td>27</td>
            <td>2011/01/25</td>
            <td>$112,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Doris Wilder</td>
            <td>Sales Assistant</td>
            <td>Sidney</td>
            <td>23</td>
            <td>2010/09/20</td>
            <td>$85,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Finn Camacho</td>
            <td>Support Engineer</td>
            <td>San Francisco</td>
            <td>47</td>
            <td>2009/07/07</td>
            <td>$87,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Fiona Green</td>
            <td>Chief Operating Officer (COO)</td>
            <td>San Francisco</td>
            <td>48</td>
            <td>2010/03/11</td>
            <td>$850,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Garrett Winters</td>
            <td>Accountant</td>
            <td>Tokyo</td>
            <td>63</td>
            <td>2011/07/25</td>
            <td>$170,750</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Gavin Cortez</td>
            <td>Team Leader</td>
            <td>San Francisco</td>
            <td>22</td>
            <td>2008/10/26</td>
            <td>$235,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Gavin Joyce</td>
            <td>Developer</td>
            <td>Edinburgh</td>
            <td>42</td>
            <td>2010/12/22</td>
            <td>$92,575</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Gloria Little</td>
            <td>Systems Administrator</td>
            <td>New York</td>
            <td>59</td>
            <td>2009/04/10</td>
            <td>$237,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Haley Kennedy</td>
            <td>Senior Marketing Designer</td>
            <td>London</td>
            <td>43</td>
            <td>2012/12/18</td>
            <td>$313,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Hermione Butler</td>
            <td>Regional Director</td>
            <td>London</td>
            <td>47</td>
            <td>2011/03/21</td>
            <td>$356,250</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Herrod Chandler</td>
            <td>Sales Assistant</td>
            <td>San Francisco</td>
            <td>59</td>
            <td>2012/08/06</td>
            <td>$137,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Hope Fuentes</td>
            <td>Secretary</td>
            <td>San Francisco</td>
            <td>41</td>
            <td>2010/02/12</td>
            <td>$109,850</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Howard Hatfield</td>
            <td>Office Manager</td>
            <td>San Francisco</td>
            <td>51</td>
            <td>2008/12/16</td>
            <td>$164,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Jackson Bradshaw</td>
            <td>Director</td>
            <td>New York</td>
            <td>65</td>
            <td>2008/09/26</td>
            <td>$645,750</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Jena Gaines</td>
            <td>Office Manager</td>
            <td>London</td>
            <td>30</td>
            <td>2008/12/19</td>
            <td>$90,560</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Jenette Caldwell</td>
            <td>Development Lead</td>
            <td>New York</td>
            <td>30</td>
            <td>2011/09/03</td>
            <td>$345,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Jennifer Acosta</td>
            <td>Junior Javascript Developer</td>
            <td>Edinburgh</td>
            <td>43</td>
            <td>2013/02/01</td>
            <td>$75,650</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Jennifer Chang</td>
            <td>Regional Director</td>
            <td>Singapore</td>
            <td>28</td>
            <td>2010/11/14</td>
            <td>$357,650</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Jonas Alexander</td>
            <td>Developer</td>
            <td>San Francisco</td>
            <td>30</td>
            <td>2010/07/14</td>
            <td>$86,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Lael Greer</td>
            <td>Systems Administrator</td>
            <td>London</td>
            <td>21</td>
            <td>2009/02/27</td>
            <td>$103,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Martena Mccray</td>
            <td>Post-Sales support</td>
            <td>Edinburgh</td>
            <td>46</td>
            <td>2011/03/09</td>
            <td>$324,050</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Michael Bruce</td>
            <td>Javascript Developer</td>
            <td>Singapore</td>
            <td>29</td>
            <td>2011/06/27</td>
            <td>$183,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Michael Silva</td>
            <td>Marketing Designer</td>
            <td>London</td>
            <td>66</td>
            <td>2012/11/27</td>
            <td>$198,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Michelle House</td>
            <td>Integration Specialist</td>
            <td>Sidney</td>
            <td>37</td>
            <td>2011/06/02</td>
            <td>$95,400</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Olivia Liang</td>
            <td>Support Engineer</td>
            <td>Singapore</td>
            <td>64</td>
            <td>2011/02/03</td>
            <td>$234,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Paul Byrd</td>
            <td>Chief Financial Officer (CFO)</td>
            <td>New York</td>
            <td>64</td>
            <td>2010/06/09</td>
            <td>$725,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Prescott Bartlett</td>
            <td>Technical Author</td>
            <td>London</td>
            <td>27</td>
            <td>2011/05/07</td>
            <td>$145,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Quinn Flynn</td>
            <td>Support Lead</td>
            <td>Edinburgh</td>
            <td>22</td>
            <td>2013/03/03</td>
            <td>$342,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Rhona Davidson</td>
            <td>Integration Specialist</td>
            <td>Tokyo</td>
            <td>55</td>
            <td>2010/10/14</td>
            <td>$327,900</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Sakura Yamamoto</td>
            <td>Support Engineer</td>
            <td>Tokyo</td>
            <td>37</td>
            <td>2009/08/19</td>
            <td>$139,575</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Serge Baldwin</td>
            <td>Data Coordinator</td>
            <td>Singapore</td>
            <td>64</td>
            <td>2012/04/09</td>
            <td>$138,575</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Shad Decker</td>
            <td>Regional Director</td>
            <td>Edinburgh</td>
            <td>51</td>
            <td>2008/11/13</td>
            <td>$183,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Shou Itou</td>
            <td>Regional Marketing</td>
            <td>Tokyo</td>
            <td>20</td>
            <td>2011/08/14</td>
            <td>$163,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Sonya Frost</td>
            <td>Software Engineer</td>
            <td>Edinburgh</td>
            <td>23</td>
            <td>2008/12/13</td>
            <td>$103,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Suki Burks</td>
            <td>Developer</td>
            <td>London</td>
            <td>53</td>
            <td>2009/10/22</td>
            <td>$114,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Tatyana Fitzpatrick</td>
            <td>Regional Director</td>
            <td>London</td>
            <td>19</td>
            <td>2010/03/17</td>
            <td>$385,750</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Thor Walton</td>
            <td>Developer</td>
            <td>New York</td>
            <td>61</td>
            <td>2013/08/11</td>
            <td>$98,540</td>
        </tr>
    </tbody>
</table>`)

        let b = el(`<table id="example" class="display dataTable" cellspacing="0" width="100%" role="grid" aria-describedby="example_info" style="width: 100%;">
    <thead>
        <tr role="row">
            <th class="sorting_desc" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-sort="descending" aria-label="Name: activate to sort column ascending" style="width: 137px;">Name</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending" style="width: 214px;">Position</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 103px;">Office</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 41px;">Age</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 92px;">Start date</th>
            <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Salary: activate to sort column ascending" style="width: 80px;">Salary</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
            <th rowspan="1" colspan="1">Name</th>
            <th rowspan="1" colspan="1">Position</th>
            <th rowspan="1" colspan="1">Office</th>
            <th rowspan="1" colspan="1">Age</th>
            <th rowspan="1" colspan="1">Start date</th>
            <th rowspan="1" colspan="1">Salary</th>
        </tr>
    </tfoot>
    <tbody>
        <tr role="row" class="odd">
            <td class="sorting_1">Zorita Serrano</td>
            <td>Software Engineer</td>
            <td>San Francisco</td>
            <td>56</td>
            <td>2012/06/01</td>
            <td>$115,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Zenaida Frank</td>
            <td>Software Engineer</td>
            <td>New York</td>
            <td>63</td>
            <td>2010/01/04</td>
            <td>$125,250</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Yuri Berry</td>
            <td>Chief Marketing Officer (CMO)</td>
            <td>New York</td>
            <td>40</td>
            <td>2009/06/25</td>
            <td>$675,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Vivian Harrell</td>
            <td>Financial Controller</td>
            <td>San Francisco</td>
            <td>62</td>
            <td>2009/02/14</td>
            <td>$452,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Unity Butler</td>
            <td>Marketing Designer</td>
            <td>San Francisco</td>
            <td>47</td>
            <td>2009/12/09</td>
            <td>$85,675</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Timothy Mooney</td>
            <td>Office Manager</td>
            <td>London</td>
            <td>37</td>
            <td>2008/12/11</td>
            <td>$136,200</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Tiger Nixon</td>
            <td>System Architect</td>
            <td>Edinburgh</td>
            <td>61</td>
            <td>2011/04/25</td>
            <td>$320,800</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Thor Walton</td>
            <td>Developer</td>
            <td>New York</td>
            <td>61</td>
            <td>2013/08/11</td>
            <td>$98,540</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Tatyana Fitzpatrick</td>
            <td>Regional Director</td>
            <td>London</td>
            <td>19</td>
            <td>2010/03/17</td>
            <td>$385,750</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Suki Burks</td>
            <td>Developer</td>
            <td>London</td>
            <td>53</td>
            <td>2009/10/22</td>
            <td>$114,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Sonya Frost</td>
            <td>Software Engineer</td>
            <td>Edinburgh</td>
            <td>23</td>
            <td>2008/12/13</td>
            <td>$103,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Shou Itou</td>
            <td>Regional Marketing</td>
            <td>Tokyo</td>
            <td>20</td>
            <td>2011/08/14</td>
            <td>$163,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Shad Decker</td>
            <td>Regional Director</td>
            <td>Edinburgh</td>
            <td>51</td>
            <td>2008/11/13</td>
            <td>$183,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Serge Baldwin</td>
            <td>Data Coordinator</td>
            <td>Singapore</td>
            <td>64</td>
            <td>2012/04/09</td>
            <td>$138,575</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Sakura Yamamoto</td>
            <td>Support Engineer</td>
            <td>Tokyo</td>
            <td>37</td>
            <td>2009/08/19</td>
            <td>$139,575</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Rhona Davidson</td>
            <td>Integration Specialist</td>
            <td>Tokyo</td>
            <td>55</td>
            <td>2010/10/14</td>
            <td>$327,900</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Quinn Flynn</td>
            <td>Support Lead</td>
            <td>Edinburgh</td>
            <td>22</td>
            <td>2013/03/03</td>
            <td>$342,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Prescott Bartlett</td>
            <td>Technical Author</td>
            <td>London</td>
            <td>27</td>
            <td>2011/05/07</td>
            <td>$145,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Paul Byrd</td>
            <td>Chief Financial Officer (CFO)</td>
            <td>New York</td>
            <td>64</td>
            <td>2010/06/09</td>
            <td>$725,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Olivia Liang</td>
            <td>Support Engineer</td>
            <td>Singapore</td>
            <td>64</td>
            <td>2011/02/03</td>
            <td>$234,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Michelle House</td>
            <td>Integration Specialist</td>
            <td>Sidney</td>
            <td>37</td>
            <td>2011/06/02</td>
            <td>$95,400</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Michael Silva</td>
            <td>Marketing Designer</td>
            <td>London</td>
            <td>66</td>
            <td>2012/11/27</td>
            <td>$198,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Michael Bruce</td>
            <td>Javascript Developer</td>
            <td>Singapore</td>
            <td>29</td>
            <td>2011/06/27</td>
            <td>$183,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Martena Mccray</td>
            <td>Post-Sales support</td>
            <td>Edinburgh</td>
            <td>46</td>
            <td>2011/03/09</td>
            <td>$324,050</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Lael Greer</td>
            <td>Systems Administrator</td>
            <td>London</td>
            <td>21</td>
            <td>2009/02/27</td>
            <td>$103,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Jonas Alexander</td>
            <td>Developer</td>
            <td>San Francisco</td>
            <td>30</td>
            <td>2010/07/14</td>
            <td>$86,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Jennifer Chang</td>
            <td>Regional Director</td>
            <td>Singapore</td>
            <td>28</td>
            <td>2010/11/14</td>
            <td>$357,650</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Jennifer Acosta</td>
            <td>Junior Javascript Developer</td>
            <td>Edinburgh</td>
            <td>43</td>
            <td>2013/02/01</td>
            <td>$75,650</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Jenette Caldwell</td>
            <td>Development Lead</td>
            <td>New York</td>
            <td>30</td>
            <td>2011/09/03</td>
            <td>$345,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Jena Gaines</td>
            <td>Office Manager</td>
            <td>London</td>
            <td>30</td>
            <td>2008/12/19</td>
            <td>$90,560</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Jackson Bradshaw</td>
            <td>Director</td>
            <td>New York</td>
            <td>65</td>
            <td>2008/09/26</td>
            <td>$645,750</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Howard Hatfield</td>
            <td>Office Manager</td>
            <td>San Francisco</td>
            <td>51</td>
            <td>2008/12/16</td>
            <td>$164,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Hope Fuentes</td>
            <td>Secretary</td>
            <td>San Francisco</td>
            <td>41</td>
            <td>2010/02/12</td>
            <td>$109,850</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Herrod Chandler</td>
            <td>Sales Assistant</td>
            <td>San Francisco</td>
            <td>59</td>
            <td>2012/08/06</td>
            <td>$137,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Hermione Butler</td>
            <td>Regional Director</td>
            <td>London</td>
            <td>47</td>
            <td>2011/03/21</td>
            <td>$356,250</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Haley Kennedy</td>
            <td>Senior Marketing Designer</td>
            <td>London</td>
            <td>43</td>
            <td>2012/12/18</td>
            <td>$313,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Gloria Little</td>
            <td>Systems Administrator</td>
            <td>New York</td>
            <td>59</td>
            <td>2009/04/10</td>
            <td>$237,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Gavin Joyce</td>
            <td>Developer</td>
            <td>Edinburgh</td>
            <td>42</td>
            <td>2010/12/22</td>
            <td>$92,575</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Gavin Cortez</td>
            <td>Team Leader</td>
            <td>San Francisco</td>
            <td>22</td>
            <td>2008/10/26</td>
            <td>$235,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Garrett Winters</td>
            <td>Accountant</td>
            <td>Tokyo</td>
            <td>63</td>
            <td>2011/07/25</td>
            <td>$170,750</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Fiona Green</td>
            <td>Chief Operating Officer (COO)</td>
            <td>San Francisco</td>
            <td>48</td>
            <td>2010/03/11</td>
            <td>$850,000</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Finn Camacho</td>
            <td>Support Engineer</td>
            <td>San Francisco</td>
            <td>47</td>
            <td>2009/07/07</td>
            <td>$87,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Doris Wilder</td>
            <td>Sales Assistant</td>
            <td>Sidney</td>
            <td>23</td>
            <td>2010/09/20</td>
            <td>$85,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Donna Snider</td>
            <td>Customer Support</td>
            <td>New York</td>
            <td>27</td>
            <td>2011/01/25</td>
            <td>$112,000</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Dai Rios</td>
            <td>Personnel Lead</td>
            <td>Edinburgh</td>
            <td>35</td>
            <td>2012/09/26</td>
            <td>$217,500</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Colleen Hurst</td>
            <td>Javascript Developer</td>
            <td>San Francisco</td>
            <td>39</td>
            <td>2009/09/15</td>
            <td>$205,500</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Charde Marshall</td>
            <td>Regional Director</td>
            <td>San Francisco</td>
            <td>36</td>
            <td>2008/10/16</td>
            <td>$470,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Cedric Kelly</td>
            <td>Senior Javascript Developer</td>
            <td>Edinburgh</td>
            <td>22</td>
            <td>2012/03/29</td>
            <td>$433,060</td>
        </tr>
        <tr role="row" class="odd">
            <td class="sorting_1">Cara Stevens</td>
            <td>Sales Assistant</td>
            <td>New York</td>
            <td>46</td>
            <td>2011/12/06</td>
            <td>$145,600</td>
        </tr>
        <tr role="row" class="even">
            <td class="sorting_1">Caesar Vance</td>
            <td>Pre-Sales Support</td>
            <td>New York</td>
            <td>21</td>
            <td>2011/12/12</td>
            <td>$106,450</td>
        </tr>
    </tbody>
</table>`)

        let res = patch(a, b.cloneNode(true)) as HTMLElement

        expect(res?.outerHTML).toEqual(b.outerHTML)
    })
})