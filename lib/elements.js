// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/** @module lib/elements */

import {codeBlockElements} from './highlight.js';
import {getMarkdownParagraphText} from './parser.js';


/**
 * The markdownElements function's options object
 *
 * @typedef {Object} MarkdownElementsOptions
 * @property {Object.<string, function>} [codeBlocks] - The [code block]{@link module:lib/elements~CodeBlockFn} render function map
 * @property {boolean} [copyLinks] - If true, generate copy-to-clipboard buttons on fenced code
 *     blocks
 * @property {number} [copyLinksIndex] - Next copy-button id index (default 1). Mutated when
 *     `copyLinks` is true.
 * @property {function} [urlFn] - The [URL modifier function]{@link module:lib/elements~URLFn}
 * @property {boolean} [headerIds] - If true, generate header IDs
 * @property {Set} [usedHeaderIds] - Set of used header IDs
 */

/**
 * A code block render function
 *
 * @callback CodeBlockFn
 * @param {Object} codeBlock - The [code block model]{@link module:lib/elements~CodeBlock}
 * @param {?Object} options - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The code block's element model
 */

/**
 * @typedef {Object} CodeBlock
 * @property {?string} language - The code block language
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
 * Generate an element model from a Markdown model.
 *
 * @param {Object} markdown - The [Markdown model]{@link https://craigahobbs.github.io/markdown-model/model/#var.vName='Markdown'}
 * @param {?Object} [options] - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The Markdown's [element model]{@link https://github.com/craigahobbs/element-model#readme}
 */
export function markdownElements(markdown, options = null) {
    const usedHeaderIds = (options !== null && 'usedHeaderIds' in options ? options.usedHeaderIds : new Set());
    return markdownPartsElements(markdown.parts, options, usedHeaderIds);
}


function markdownPartsElements(parts, options, usedHeaderIds) {
    const elements = [];
    for (const part of parts) {
        elements.push(markdownPartElements(part, options, usedHeaderIds));
    }
    return elements;
}


function markdownPartElements(part, options, usedHeaderIds) {
    // List?
    const {list} = part;
    if (list) {
        const listItemElements = [];
        for (const item of list.items) {
            const itemElements = markdownPartsElements(item.parts, options, usedHeaderIds);
            listItemElements.push({'html': 'li', 'elem': itemElements});
        }
        return markdownListPartElements(part, listItemElements);
    }

    // Block quote?
    const {quote} = part;
    if (quote) {
        return {
            'html': 'blockquote',
            'elem': markdownPartsElements(quote.parts, options, usedHeaderIds)
        };
    }

    // Code block?
    const {codeBlock} = part;
    if (codeBlock) {
        return codeBlockElements(codeBlock, options);
    }

    return markdownPartElementsBase(part, options, usedHeaderIds);
}


/**
 * Generate an element model from a Markdown model.
 *
 * This is the asynchronous form of the [markdownElements function]{@link module:lib/elements.markdownElements}.
 * Use this form of the function if you have one or more asynchronous code block functions.
 *
 * @param {Object} markdown - The [Markdown model]{@link https://craigahobbs.github.io/markdown-model/model/#var.vName='Markdown'}
 * @param {?Object} [options] - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The Markdown's [element model]{@link https://github.com/craigahobbs/element-model#readme}
 */
export function markdownElementsAsync(markdown, options = null) {
    const usedHeaderIds = (options !== null && 'usedHeaderIds' in options ? options.usedHeaderIds : new Set());
    return markdownPartsElementsAsync(markdown.parts, options, usedHeaderIds);
}


async function markdownPartsElementsAsync(parts, options, usedHeaderIds) {
    const elements = [];
    for (const part of parts) {
        elements.push(await markdownPartElementsAsync(part, options, usedHeaderIds));
    }
    return elements;
}


async function markdownPartElementsAsync(part, options, usedHeaderIds) {
    // List?
    const {list} = part;
    if (list) {
        const listItemElements = [];
        for (const item of list.items) {
            const itemElements = await markdownPartsElementsAsync(item.parts, options, usedHeaderIds);
            listItemElements.push({'html': 'li', 'elem': itemElements});
        }
        return markdownListPartElements(part, listItemElements);
    }

    // Block quote?
    const {quote} = part;
    if (quote) {
        return {
            'html': 'blockquote',
            'elem': await markdownPartsElementsAsync(quote.parts, options, usedHeaderIds)
        };
    }

    // Code block?
    const {codeBlock} = part;
    if (codeBlock) {
        return codeBlockElements(codeBlock, options);
    }

    return markdownPartElementsBase(part, options, usedHeaderIds);
}


function markdownListPartElements(part, listItemElements) {
    const startValue = part.list.start;
    return {
        'html': typeof startValue === 'number' ? 'ol' : 'ul',
        'attr': typeof startValue === 'number' && startValue > 1 ? {'start': `${startValue}`} : null,
        'elem': listItemElements
    };
}


function markdownPartElementsBase(part, options, usedHeaderIds) {
    // Paragraph?
    const {paragraph} = part;
    if (paragraph) {
        const {style: paragraphStyle} = paragraph;
        if (paragraphStyle) {
            // Determine the header ID, if requested
            let headerId = null;
            if (options && options.headerIds) {
                headerId = markdownHeaderId(getMarkdownParagraphText(paragraph));

                // Duplicate header ID?
                if (usedHeaderIds.has(headerId)) {
                    let ix = 2;
                    let headerIdNew = `${headerId}${ix}`;
                    while (usedHeaderIds.has(headerIdNew)) {
                        ix += 1;
                        headerIdNew = `${headerId}${ix}`;
                    }
                    headerId = headerIdNew;
                }
                usedHeaderIds.add(headerId);

                // Header ID hash URL fixup?
                const {urlFn} = options;
                if (urlFn) {
                    headerId = urlFn(`#${headerId}`).slice(1);
                }
            }

            return {
                'html': paragraphStyle,
                'attr': headerId !== null ? {'id': headerId} : null,
                'elem': paragraphSpanElements(paragraph.spans, options)
            };
        }

        return {
            'html': 'p',
            'elem': paragraphSpanElements(paragraph.spans, options)
        };
    }

    // Table?
    const {table} = part;
    if (table) {
        const {aligns} = table;
        const alignsLength = aligns.length;

        // Header elements
        const headerElements = [];
        for (const [ixHeader, header] of table.headers.entries()) {
            const headerAlign = ixHeader < alignsLength ? aligns[ixHeader] : 'left';
            headerElements.push({
                'html': 'th',
                'attr': {'style': `text-align: ${headerAlign}`},
                'elem': paragraphSpanElements(header, options)
            });
        }

        // Row elements
        let rowsElement = null;
        if ('rows' in table) {
            const rowElements = [];
            for (const row of table.rows) {
                const cellElements = [];
                for (const [ixCell, cell] of row.entries()) {
                    const cellAlign = ixCell < alignsLength ? aligns[ixCell] : 'left';
                    cellElements.push({
                        'html': 'td',
                        'attr': {'style': `text-align: ${cellAlign}`},
                        'elem': paragraphSpanElements(cell, options)
                    });
                }
                rowElements.push({'html': 'tr', 'elem': cellElements});
            }
            rowsElement = {'html': 'tbody', 'elem': rowElements};
        }

        return {
            'html': 'table',
            'elem': [
                {
                    'html': 'thead',
                    'elem': {
                        'html': 'tr',
                        'elem': headerElements
                    }
                },
                rowsElement
            ]
        };
    }

    // Horizontal rule
    // elif partKey === 'hr'
    return {'html': 'hr'};
}


// Helper function to generate an element model from a markdown span model array
function paragraphSpanElements(spans, options) {
    const urlFn = options ? options.urlFn : null;
    const spanElements = [];
    for (const span of spans) {
        // Text span?
        const {text} = span;
        if (text) {
            spanElements.push({'text': text});
            continue;
        }

        // Style span?
        const {style} = span;
        if (style) {
            const {style: styleStyle} = style;
            spanElements.push({
                'html': (styleStyle === 'bold' ? 'strong' : (styleStyle === 'italic' ? 'em' : 'del')),
                'elem': paragraphSpanElements(style.spans, options)
            });
            continue;
        }

        // Link span?
        const {link} = span;
        if (link) {
            let {href} = link;
            if (urlFn) {
                href = urlFn(href);
            }
            const linkAttr = {'href': href};
            if ('title' in link) {
                linkAttr.title = link.title;
            }
            spanElements.push({
                'html': 'a',
                'attr': linkAttr,
                'elem': paragraphSpanElements(link.spans, options)
            });
            continue;
        }

        // Link reference span?
        const {linkRef} = span;
        if (linkRef) {
            spanElements.push(...paragraphSpanElements(linkRef.spans, options));
            continue;
        }

        // Code span?
        const {code} = span;
        if (code) {
            spanElements.push({'html': 'code', 'elem': {'text': code}});
            continue;
        }

        // Image span?
        const {image} = span;
        if (image) {
            let {src} = image;
            if (urlFn) {
                src = urlFn(src);
            }
            const imageAttr = {'src': src, 'alt': image.alt, 'style': 'max-width: 100%;'};
            if ('title' in image) {
                imageAttr.title = image.title;
            }
            spanElements.push({'html': 'img', 'attr': imageAttr});
            continue;
        }

        // Line break?
        if (span.br) {
            spanElements.push({'html': 'br'});
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
