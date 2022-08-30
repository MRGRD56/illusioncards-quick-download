// ==UserScript==
// @name         illusioncards.booru.org card download buttons
// @namespace    https://illusioncards.booru.org
// @version      1.0
// @author       MRGRD56
// @match        https://illusioncards.booru.org/index.php?page=post*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
    const DOWNLOAD_SVG = '<svg focusable="false" viewBox="0 0 24 24" width="24" height="24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path></svg>';

    const CUSTOM_CSS = `
.mrgrd56__card-download-button {
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: 3px;
    border: 1px solid rgba(66, 66, 66, 0.8);
    background: rgba(33, 33, 33, 0.8);
    padding: 4px;
    margin: 3px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.1s;
}

.mrgrd56__card-download-button > svg {
    fill: white;
    transition: fill 0.08s ease-in;
}

.mrgrd56__card-download-button:hover > svg {
    fill: #2196f3;
}

.content .thumb > a:hover > .mrgrd56__card-download-button {
    opacity: 1;
}

.content .thumb > a {
    position: relative;
    display: inline-block;
}
`.trimStart();

    document.head.innerHTML += `\n<style>${CUSTOM_CSS}</style>`;

    const getFullImageUrl = (thumbUrl) => {
        const regex = /\/thumbnails\/\/?(\d+)\/thumbnail_(.+)/;
        const match = regex.exec(thumbUrl);
        if (!match) {
            return;
        }

        const [, number, fileName] = match;

        if (!number?.trim() || !fileName?.trim()) {
            return;
        }

        return `https://img.booru.org/illusioncards/images/${number}/${fileName}`;
    };

    const createDownloadButton = (thumb) => {
        const thumbLink = thumb.firstElementChild;
        const img = thumbLink.firstElementChild;
        const imageUrl = getFullImageUrl(img.src);

        if (!imageUrl) {
            return undefined;
        }

        const button = document.createElement('a');
        button.classList.add('mrgrd56__card-download-button');
        button.href = imageUrl;
        button.download = '';
        button.target = '_blank';
        button.innerHTML = DOWNLOAD_SVG;

        thumbLink.appendChild(button);
    };

    const thumbs = document.querySelectorAll('.content .thumb');
    thumbs.forEach(createDownloadButton);

    document.getElementById('pi')?.click();
})();
