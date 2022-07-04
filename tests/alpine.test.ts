import {expect, it} from 'vitest';
import patch, {el} from '../src/patch';


it('should not do anything when elements are equal', () => {
    let a = el(`
<ul>
    <li>foo<input></li>
</ul>
`)
    let b = el(`
<ul>
    <li>bar<input></li>
    <li>baz<input></li>
    <li>foo<input></li>
</ul>
`)

    let res = patch(a, b) as HTMLElement

    console.log(res.outerHTML)

    expect(res.querySelectorAll('li').length).toBe(3)
    /*
    expect('li:nth-of-type(1)').should(haveText('bar'))
    expect('li:nth-of-type(2)').should(haveText('baz'))
    expect('li:nth-of-type(3)').should(haveText('foo'))
    expect('li:nth-of-type(1) input').should(haveValue(''))
    expect('li:nth-of-type(2) input').should(haveValue(''))
    expect('li:nth-of-type(3) input').should(haveValue('foo'))*/
})