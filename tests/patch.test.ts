import {expect, it} from 'vitest';
import patch, {el} from '../src/patch';

/**
 * This is my own test suite.
 */

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
    /** @ts-ignore */
    expect(res?.disabled).toEqual(true)
})

it('should remove disabled', () => {
    let a = el(`<input type="text" name="t" disabled>`)
    let b = el(`<input type="text" name="t">`)

    let res = patch(a, b.cloneNode(true)) as HTMLElement

    expect(res?.outerHTML).toEqual(b.outerHTML)
    /** @ts-ignore */
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
    /** @ts-ignore */
    expect(res?.checked).toEqual(true)
})


it('should uncheck', () => {
    let a = el(`<input type="checkbox" name="t" checked>`)
    let b = el(`<input type="checkbox" name="t">`)

    let res = patch(a, b.cloneNode(true)) as HTMLElement

    expect(res?.outerHTML).toEqual(b.outerHTML)
    /** @ts-ignore */
    expect(res?.checked).toEqual(false)
})

it('should remove input value', () => {
    let a = el(`<input type="text" name="t" value="This is a journey into sound.">`)
    let b = el(`<input type="text" name="t">`)

    let res = patch(a, b.cloneNode(true)) as HTMLElement

    expect(res?.outerHTML).toEqual(b.outerHTML)
    /** @ts-ignore */
    expect(res?.value).toEqual('')
})

it('should add input value', () => {
    let a = el(`<input type="text" name="t">`)
    let b = el(`<input type="text" name="t" value="This is a journey into sound.">`)

    let res = patch(a, b.cloneNode(true)) as HTMLElement

    expect(res?.outerHTML).toEqual(b.outerHTML)
    /** @ts-ignore */
    expect(res?.value).toEqual('This is a journey into sound.')
})

it('should change input value', () => {
    let a = el(`<input type="text" name="t" value="A big brass band.">`)
    let b = el(`<input type="text" name="t" value="This is a journey into sound.">`)

    let res = patch(a, b.cloneNode(true)) as HTMLElement

    expect(res?.outerHTML).toEqual(b.outerHTML)
    /** @ts-ignore */
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

    console.log(res?.outerHTML)

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