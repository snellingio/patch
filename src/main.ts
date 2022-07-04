import {patchElement} from "./patch";

function domLoaded() {
    console.log('dom loaded')
}

function pageLoaded() {
    console.log('page load complete')
}

function popstate() {
    console.log('pageLoaded complete')
}

async function click(event: MouseEvent) {
    if (!clickEventIsSignificant(event)) {
        return
    }

    if (!(event.target instanceof HTMLElement)) {
        return
    }

    let link = event.target.closest('a[href]:not([target]):not([download])')

    if (!(link instanceof HTMLAnchorElement)) {
        return
    }

    if ((window.location.hostname !== link.hostname)) {
        return;
    }

    event.preventDefault();

    const response = await fuckingFetch(link.href);
    const html = await response.text()

    const element = document.createElement("html")
    element.innerHTML = html

    let body = element.querySelector("body")
    if (body) {
        patchElement(document.body, body)
    }

}

async function fuckingFetch(input: RequestInfo | URL, options = {
    timeout: 8000,
}) {
    const { timeout  } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(input, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

function clickEventIsSignificant(event: MouseEvent) {
    return !(
        (event.target && (event.target as any).isContentEditable)
        || event.defaultPrevented
        || event.which > 1
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey
    )
}


addEventListener('DOMContentLoaded', domLoaded, false)
addEventListener('load', pageLoaded, false);
addEventListener('popstate', popstate, false);
addEventListener('click', click, true)

export {}