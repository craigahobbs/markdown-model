// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/** @module lib/elements */

import {getMarkdownParagraphText} from './parser.js';


/**
 * The markdownElements function's options object
 *
 * @typedef {Object} MarkdownElementsOptions
 * @property {Object.<string, object>} [codeBlocks] - The [code block]{@link module:lib/elements~CodeBlockFn} render-function map
 * @property {function} [urlFn] - The [URL modifier function]{@link module:lib/elements~URLFn}
 * @property {boolean} [headerIds] - If true, generate header IDs
 * @property {Set} [usedHeaderIds] - Set of used header IDs
 */

/**
 * A code block render function
 *
 * @callback CodeBlockFn
 * @param {object} codeBlock - The [code block model]{@link module:lib/elements~CodeBlock}
 * @returns {*} The code block's element model
 */

/**
 * @typedef {Object} CodeBlock
 * @property {string} language - The code block language
 * @property {string[]} lines - The code blocks lines
 * @property {number} [startLineNumber] - The code blocks lines
 */

/**
 * A URL modifier function
 *
 * @callback URLFn
 * @param {string} url - The URL
 * @returns {string} The modified URL
 */


/**
 * Generate an element model from a markdown model.
 *
 * @param {Object} markdown - The markdown model
 * @param {?object} [options] - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The markdown's element model
 */
export function markdownElements(markdown, options = null) {
    const usedHeaderIds = (options !== null && 'usedHeaderIds' in options ? options.usedHeaderIds : new Set());
    return markdownElementsParts(markdown.parts, options, usedHeaderIds);
}


function markdownElementsParts(parts, options, usedHeaderIds) {
    return parts.map((part) => markdownElementsPart(part, options, usedHeaderIds));
}


function markdownElementsPart(part, options, usedHeaderIds) {
    const [partKey] = Object.keys(part);

    // List?
    if (partKey === 'list') {
        const {items} = part.list;
        const itemElements = items.map((item) => markdownElementsParts(item.parts, options, usedHeaderIds));
        return markdownElementsListPart(part, itemElements.map((elem) => ({'html': 'li', 'elem': elem})));

    // Code block?
    } else if (partKey === 'codeBlock') {
        const {codeBlock} = part;
        if (options !== null && 'codeBlocks' in options && 'language' in codeBlock && codeBlock.language in options.codeBlocks) {
            return options.codeBlocks[codeBlock.language](codeBlock);
        }
        return markdownElementsCodeBlockPart(part);
    }

    return markdownElementsPartBase(part, options, usedHeaderIds);
}


/**
 * Generate an element model from a markdown model.
 *
 * This is the asynchronous form of the [markdownElements function]{@link module:lib/elements.markdownElements}.
 * Use this form of the function if you have one or more asynchronous code block functions.
 *
 * @async
 * @param {Object} markdown - The markdown model
 * @param {?object} [options] - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The markdown's element model
 */
// eslint-disable-next-line require-await
export async function markdownElementsAsync(markdown, options = null) {
    const usedHeaderIds = (options !== null && 'usedHeaderIds' in options ? options.usedHeaderIds : new Set());
    return markdownElementsPartsAsync(markdown.parts, options, usedHeaderIds);
}


// eslint-disable-next-line require-await
async function markdownElementsPartsAsync(parts, options, usedHeaderIds) {
    const elements = [];
    for (const part of parts) {
        // eslint-disable-next-line no-await-in-loop
        elements.push(await markdownElementsPartAsync(part, options, usedHeaderIds));
    }
    return elements;
}


async function markdownElementsPartAsync(part, options, usedHeaderIds) {
    const [partKey] = Object.keys(part);

    // List?
    if (partKey === 'list') {
        const {items} = part.list;
        const itemElements = [];
        for (const item of items) {
            // eslint-disable-next-line no-await-in-loop
            itemElements.push(await markdownElementsPartsAsync(item.parts, options, usedHeaderIds));
        }
        return markdownElementsListPart(part, itemElements.map((elem) => ({'html': 'li', 'elem': elem})));

    // Code block?
    } else if (partKey === 'codeBlock') {
        const {codeBlock} = part;
        if (options !== null && 'codeBlocks' in options && 'language' in codeBlock && codeBlock.language in options.codeBlocks) {
            return options.codeBlocks[codeBlock.language](codeBlock);
        }
        return markdownElementsCodeBlockPart(part);
    }

    return markdownElementsPartBase(part, options, usedHeaderIds);
}


function markdownElementsListPart(part, listItemElements) {
    const {list} = part;
    return {
        'html': 'start' in list ? 'ol' : 'ul',
        'attr': 'start' in list && list.start > 1 ? {'start': `${list.start}`} : null,
        'elem': listItemElements
    };
}


function markdownElementsCodeBlockPart(part) {
    const {codeBlock} = part;
    return {
        'html': 'pre',
        'elem': {
            'html': 'code',
            'elem': codeBlock.lines.map((line) => ({'text': `${line}\n`}))
        }
    };
}


function markdownElementsPartBase(part, options, usedHeaderIds) {
    const [partKey] = Object.keys(part);

    // Paragraph?
    if (partKey === 'paragraph') {
        const {paragraph} = part;
        if ('style' in paragraph) {
            // Determine the header ID, if requested
            let headerId = null;
            if (options !== null && 'headerIds' in options && options.headerIds) {
                headerId = markdownHeaderId(getMarkdownParagraphText(paragraph));

                // Duplicate header ID?
                if (usedHeaderIds.has(headerId)) {
                    let ix = 1;
                    let headerIdNew;
                    do {
                        ix += 1;
                        headerIdNew = `${headerId}${ix}`;
                    } while (usedHeaderIds.has(headerIdNew));
                    headerId = headerIdNew;
                }
                usedHeaderIds.add(headerId);

                // Header ID hash URL fixup?
                if (options !== null && 'urlFn' in options) {
                    headerId = options.urlFn(`#${headerId}`).slice(1);
                }
            }

            return {
                'html': paragraph.style,
                'attr': headerId !== null ? {'id': headerId} : null,
                'elem': paragraphSpanElements(paragraph.spans, options)
            };
        }

        return {
            'html': 'p',
            'elem': paragraphSpanElements(paragraph.spans, options)
        };
    }

    // Horizontal rule?
    // else if (partKey === 'hr')
    return {'html': 'hr'};
}


// Helper function to generate an element model from a markdown span model array
function paragraphSpanElements(spans, options) {
    const spanElements = [];
    for (const span of spans) {
        const [spanKey] = Object.keys(span);

        // Text span?
        if (spanKey === 'text') {
            spanElements.push({'text': span.text});

        // Line break?
        } else if (spanKey === 'br') {
            spanElements.push({'html': 'br'});

        // Style span?
        } else if (spanKey === 'style') {
            const {style} = span;
            spanElements.push({
                'html': style.style === 'italic' ? 'em' : 'strong',
                'elem': paragraphSpanElements(style.spans, options)
            });

        // Link span?
        } else if (spanKey === 'link') {
            const {link} = span;
            let {href} = link;

            // URL fixup?
            if (options !== null && 'urlFn' in options) {
                href = options.urlFn(href);
            }

            const linkElements = {
                'html': 'a',
                'attr': {'href': href},
                'elem': paragraphSpanElements(link.spans, options)
            };
            if ('title' in link) {
                linkElements.attr.title = link.title;
            }
            spanElements.push(linkElements);

        // Image span?
        } else if (spanKey === 'image') {
            const {image} = span;
            let {src} = image;

            // Relative link fixup?
            if (options !== null && 'urlFn' in options) {
                src = options.urlFn(src);
            }

            const imageElement = {
                'html': 'img',
                'attr': {'src': src, 'alt': image.alt}
            };
            if ('title' in image) {
                imageElement.attr.title = image.title;
            }
            spanElements.push(imageElement);
        }
    }

    return spanElements;
}


/**
 * Generate a Markdown header ID from text
 *
 * @param {string} text - The text
 * @returns {string}
 */
export function markdownHeaderId(text) {
    return text.toLowerCase().
        replace(rHeaderStart, '').replace(rHeaderEnd, '').
        replace(rHeaderIdRemove, '').replace(rHeaderIdDash, '-');
}

const rHeaderStart = /^[^a-z0-9]+/;
const rHeaderEnd = /[^a-z0-9]+$/;
const rHeaderIdRemove = /['"]/g;
const rHeaderIdDash = /[^a-z0-9]+/g;


/**
 * Test if a URL is relative
 *
 * @param {string} url - The URL
 * @returns {boolean}
 */
export function isRelativeURL(url) {
    return !rNotRelativeURL.test(url);
}

const rNotRelativeURL = /^(?:[a-z]+:|\/|\?|#)/;


/**
 * Get a URL's base URL
 *
 * @param {string} url - The URL
 * @returns {string}
 */
export function getBaseURL(url) {
    return url.slice(0, url.lastIndexOf('/') + 1);
}
