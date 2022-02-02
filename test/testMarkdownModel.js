// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {parseMarkdown} from '../lib/parser.js';
import test from 'ava';
import {validateMarkdownModel} from '../lib/markdownModel.js';


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
