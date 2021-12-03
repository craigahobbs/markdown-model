// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {getMarkdownParagraphText, getMarkdownTitle, validateMarkdownModel} from '../lib/markdownModel.js';
import {parseMarkdown} from '../lib/parser.js';
import test from 'ava';


test('validateMarkdownModel', (t) => {
    const markdownModel = parseMarkdown(`\
# This is the *title*

This is some text
`);
    t.deepEqual(
        validateMarkdownModel(markdownModel),
        {
            'parts': [
                {
                    'paragraph': {
                        'style': 'h1',
                        'spans': [
                            {'text': 'This is the '},
                            {
                                'style': {
                                    'style': 'italic',
                                    'spans': [{'text': 'title'}]
                                }
                            }
                        ]
                    }
                },
                {
                    'paragraph': {
                        'spans': [{'text': 'This is some text'}]
                    }
                }
            ]
        }
    );
});


test('validateMarkdownModel, invalid', (t) => {
    let errorMessage = null;
    try {
        validateMarkdownModel({});
    } catch ({message}) {
        errorMessage = message;
    }
    t.is(errorMessage, "Required member 'parts' missing");
});


test('getMarkdownTitle', (t) => {
    const markdownModel = parseMarkdown(`\
This is some text

## This is the *title*

# This is NOT the *title*

This is more text
`);
    t.is(getMarkdownTitle(markdownModel), 'This is the title');
});


test('getMarkdownTitle, link', (t) => {
    const markdownModel = parseMarkdown(`\
# This is the [title](about.html)
`);
    t.is(getMarkdownTitle(markdownModel), 'This is the title');
});


test('getMarkdownTitle, image', (t) => {
    const markdownModel = parseMarkdown(`\
# This is the ![title](title.jpg)
`);
    t.is(getMarkdownTitle(markdownModel), 'This is the title');
});


test('getMarkdownTitle, no title', (t) => {
    const markdownModel = parseMarkdown(`\
This is some text

This is more text
`);
    t.is(getMarkdownTitle(markdownModel), null);
});


test('getMarkdownParagraphText', (t) => {
    const markdownModel = parseMarkdown(`\
This is a [link](link.html)
and some more text

Some other text
`);
    const [{paragraph}] = markdownModel.parts;
    t.is(getMarkdownParagraphText(paragraph), 'This is a link\nand some more text');
});
