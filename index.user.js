// ==UserScript==
// @name         illusioncards.booru.org card download buttons and cards score
// @namespace    https://illusioncards.booru.org
// @version      1.0
// @author       MRGRD56
// @match        https://illusioncards.booru.org/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('page') !== 'post' || queryParams.get('s') !== 'list') {
        return;
    }

    const DOWNLOAD_SVG = '<svg focusable="false" viewBox="0 0 24 24" width="24" height="24"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path></svg>';

    const CUSTOM_CSS = `
.mrgrd56__button {
    border-radius: 3px;
    border: 1px solid rgba(66, 66, 66, 0.8);
    background: rgba(33, 33, 33, 0.8);
    padding: 4px;
    margin: 3px;
    cursor: pointer;
    transition-property: opacity, background-color;
    transition-duration: 0.1s;
    transition-timing-function: ease-in;
}

.mrgrd56__card-download-button {
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 0;
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

.mrgrd56__card-score {
    position: absolute;
    bottom: 0;
    left: 0;
    border: none;
    background: rgba(33, 33, 33, 0.5);
    min-height: 16px;
    min-width: 16px;
}

.content .thumb > a:hover > .mrgrd56__card-score {
    background: rgba(33, 33, 33, 0.8);
}

.mrgrd56__card-score.positive {
    color: #81c784;
}

.mrgrd56__card-score.negative {
    color: #e57373;
}

.mrgrd56__card-score.neutral {
    color: #e0e0e0;
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
        button.classList.add('mrgrd56__button', 'mrgrd56__card-download-button');
        button.href = imageUrl;
        button.download = '';
        // button.target = '_blank';
        button.innerHTML = DOWNLOAD_SVG;

        thumbLink.appendChild(button);

        const imgTitle = img.title;
        if (!imgTitle) {
            return;
        }

        const titleScoreRegex = /\s?score:(-?\d+)\s?/;
        const titleScoreRegexMatch = titleScoreRegex.exec(imgTitle);
        if (!titleScoreRegexMatch) {
            return;
        }

        const score = titleScoreRegexMatch[1];
        if (!score) {
            return;
        }

        const scoreColor = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';

        const scoreElement = document.createElement('div');
        scoreElement.classList.add('mrgrd56__button', 'mrgrd56__card-score', scoreColor);
        scoreElement.textContent = score;
        thumbLink.appendChild(scoreElement);
    };

    const thumbs = document.querySelectorAll('.content .thumb');
    thumbs.forEach(createDownloadButton);

    document.getElementById('pi')?.click();
})();
