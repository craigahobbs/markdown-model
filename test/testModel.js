// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {strict as assert} from 'node:assert';
import {parseMarkdown} from '../lib/parser.js';
import test from 'node:test';
import {validateMarkdownModel} from '../lib/model.js';


test('validateMarkdownModel', () => {
    const markdownModel = parseMarkdown(`\
# This is the *title*

This is some text
`);
    assert.deepEqual(
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


test('validateMarkdownModel, invalid', () => {
    assert.throws(
        () => {
            validateMarkdownModel({});
        },
        {
            'name': 'ValidationError',
            'message': "Required member 'parts' missing"
        }
    );
});
