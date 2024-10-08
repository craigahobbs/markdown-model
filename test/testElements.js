// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {markdownElements, markdownElementsAsync} from '../lib/elements.js';
import {strict as assert} from 'node:assert';
import test from 'node:test';
import {validateElements} from 'element-model/lib/elementModel.js';
import {validateMarkdownModel} from '../lib/model.js';


test('markdownElements', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {'paragraph': {'style': 'h1', 'spans': [{'text': 'The Title'}]}},
            {
                'paragraph': {
                    'spans': [
                        {'text': 'This is a sentence. This is '},
                        {
                            'style': {
                                'style': 'bold',
                                'spans': [
                                    {'text': 'bold and '},
                                    {'style': {'style': 'italic', 'spans': [{'text': 'bold-italic'}]}},
                                    {'text': '.'}
                                ]
                            }
                        },
                        {'text': 'This is '},
                        {
                            'style': {'style': 'strikethrough', 'spans': [{'text': 'strikethrough'}]}
                        },
                        {'text': '.'}
                    ]
                }
            },
            {
                'paragraph': {
                    'spans': [
                        {'text': 'This is a link to the '},
                        {'link': {
                            'href': 'https://craigahobbs.github.io/schema-markdown/doc/',
                            'title': 'The Schema Markdown Type Model',
                            'spans': [
                                {'style': {'style': 'bold', 'spans': [{'text': 'Schema Markdown'}]}},
                                {'text': ' Type Model'}
                            ]
                        }}
                    ]
                }
            },
            {
                'paragraph': {
                    'spans': [
                        {'text': 'This is an image: '},
                        {'image': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'alt': 'Schema Markdown Documentation Icon',
                            'title': 'Schema Markdown'
                        }}
                    ]
                }
            },
            {
                'list': {
                    'items': [
                        {
                            'parts': [
                                {'paragraph': {'spans': [{'text': 'This is a paragraph.'}]}},
                                {'paragraph': {'spans': [{'text': 'This is a another paragraph.'}]}}
                            ]
                        },
                        {
                            'parts': [
                                {'paragraph': {'spans': [{'text': 'This is the second list item.'}]}}
                            ]
                        }
                    ]
                }
            },
            {
                'list': {
                    'start': 10,
                    'items': [
                        {
                            'parts': [
                                {'paragraph': {'spans': [{'text': 'This is a paragraph.'}]}}
                            ]
                        }
                    ]
                }
            },
            {
                'quote': {
                    'parts': [
                        {'paragraph': {'spans': [{'text': 'This is a paragraph.'}]}}
                    ]
                }
            },
            {
                'codeBlock': {
                    'lines': [
                        'Line 1',
                        'Line 2'
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {'html': 'h1', 'attr': null, 'elem': [{'text': 'The Title'}]},
            {
                'html': 'p',
                'elem': [
                    {'text': 'This is a sentence. This is '},
                    {'html': 'strong', 'elem': [
                        {'text': 'bold and '},
                        {'html': 'em', 'elem': [{'text': 'bold-italic'}]},
                        {'text': '.'}
                    ]},
                    {'text': 'This is '},
                    {'html': 'del', 'elem': [{'text': 'strikethrough'}]},
                    {'text': '.'}
                ]
            },
            {
                'html': 'p',
                'elem': [
                    {'text': 'This is a link to the '},
                    {
                        'html': 'a',
                        'attr': {'href': 'https://craigahobbs.github.io/schema-markdown/doc/', 'title': 'The Schema Markdown Type Model'},
                        'elem': [{'html': 'strong', 'elem': [{'text': 'Schema Markdown'}]}, {'text': ' Type Model'}]
                    }
                ]
            },
            {
                'html': 'p',
                'elem': [
                    {'text': 'This is an image: '},
                    {
                        'html': 'img',
                        'attr': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'title': 'Schema Markdown',
                            'alt': 'Schema Markdown Documentation Icon',
                            'style': 'max-width: 100%;'
                        }
                    }
                ]
            },
            {
                'html': 'ul',
                'attr': null,
                'elem': [
                    {
                        'html': 'li',
                        'elem': [
                            {'html': 'p', 'elem': [{'text': 'This is a paragraph.'}]},
                            {'html': 'p', 'elem': [{'text': 'This is a another paragraph.'}]}
                        ]
                    },
                    {
                        'html': 'li',
                        'elem': [
                            {'html': 'p', 'elem': [{'text': 'This is the second list item.'}]}
                        ]
                    }
                ]
            },
            {
                'html': 'ol',
                'attr': {'start': '10'},
                'elem': [
                    {
                        'html': 'li',
                        'elem': [
                            {'html': 'p', 'elem': [{'text': 'This is a paragraph.'}]}
                        ]
                    }
                ]
            },
            {
                'html': 'blockquote',
                'elem': [
                    {'html': 'p', 'elem': [{'text': 'This is a paragraph.'}]}
                ]
            },
            [
                null,
                {
                    'html': 'pre',
                    'attr': null,
                    'elem': {
                        'html': 'code',
                        'elem': {'text': 'Line 1\nLine 2\n'}
                    }
                }
            ]
        ]
    );
});


test('markdownElementsAsync', async () => {
    const elements = await markdownElementsAsync(
        validateMarkdownModel({
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'The Title'}]}},
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {'codeBlock': {'lines': ['Line 1', 'Line 2']}},
                                    {'codeBlock': {'language': 'async-code-block', 'lines': ['Line 1', 'Line 2']}}
                                ]
                            }
                        ]
                    }
                },
                {
                    'quote': {
                        'parts': [
                            {'codeBlock': {'lines': ['Line 1', 'Line 2']}},
                            {'codeBlock': {'language': 'async-code-block', 'lines': ['Line 1', 'Line 2']}}
                        ]
                    }
                }
            ]
        }),
        {
            'codeBlocks': {
                'async-code-block': async (codeBlock) => {
                    const awaitPromise = new Promise((resolve) => {
                        resolve(codeBlock.lines.join(', '));
                    });
                    const joinedLines = await awaitPromise;
                    return new Promise((resolve) => {
                        resolve({'html': 'p', 'elem': {'text': joinedLines}});
                    });
                }
            }
        }
    );
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {'html': 'h1', 'attr': null, 'elem': [{'text': 'The Title'}]},
            {
                'html': 'ul',
                'attr': null,
                'elem': [
                    {
                        'html': 'li',
                        'elem': [
                            [
                                null,
                                {
                                    'html': 'pre',
                                    'attr': null,
                                    'elem': {'html': 'code', 'elem': {'text': 'Line 1\nLine 2\n'}}
                                }
                            ],
                            {'html': 'p', 'elem': {'text': 'Line 1, Line 2'}}
                        ]
                    }
                ]
            },
            {
                'html': 'blockquote',
                'elem': [
                    [
                        null,
                        {
                            'html': 'pre',
                            'attr': null,
                            'elem': {'html': 'code', 'elem': {'text': 'Line 1\nLine 2\n'}}
                        }
                    ],
                    {'html': 'p', 'elem': {'text': 'Line 1, Line 2'}}
                ]
            }
        ]
    );
});


test('markdownElements, header IDs', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'style': 'h1',
                    'spans': [
                        {'text': "The @#$ Page's Title!!"}
                    ]
                }
            }
        ]
    }), {'headerIds': true});
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'h1',
                'attr': {'id': 'the-pages-title'},
                'elem': [
                    {'text': "The @#$ Page's Title!!"}
                ]
            }
        ]
    );
});


test('markdownElements, header IDs urlFn', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'style': 'h1',
                    'spans': [
                        {'text': "The @#$ Page's Title!!"}
                    ]
                }
            }
        ]
    }), {'headerIds': true, 'urlFn': (url) => `#url=README.md&${url.slice(1)}`});
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'h1',
                'attr': {'id': 'url=README.md&the-pages-title'},
                'elem': [
                    {'text': "The @#$ Page's Title!!"}
                ]
            }
        ]
    );
});


test('markdownElements, duplicate header IDs', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'style': 'h1',
                    'spans': [
                        {'text': 'The Title'}
                    ]
                }
            },
            {
                'list': {
                    'items': [
                        {
                            'parts': [
                                {
                                    'paragraph': {
                                        'style': 'h2',
                                        'spans': [
                                            {'text': 'The Title'}
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    }), {'headerIds': true});
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'h1',
                'attr': {'id': 'the-title'},
                'elem': [
                    {'text': 'The Title'}
                ]
            },
            {
                'html': 'ul',
                'attr': null,
                'elem': [
                    {
                        'html': 'li',
                        'elem': [
                            {
                                'html': 'h2',
                                'attr': {'id': 'the-title2'},
                                'elem': [
                                    {'text': 'The Title'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    );
});


test('markdownElements, duplicate header IDs with usedHeaderIds option', () => {
    const elements = markdownElements(
        validateMarkdownModel({
            'parts': [
                {
                    'paragraph': {
                        'style': 'h1',
                        'spans': [
                            {'text': 'The Title'}
                        ]
                    }
                },
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {
                                        'paragraph': {
                                            'style': 'h2',
                                            'spans': [
                                                {'text': 'The Title'}
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }),
        {
            'headerIds': true,
            'usedHeaderIds': new Set(['the-title', 'the-title2'])
        }
    );
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'h1',
                'attr': {'id': 'the-title3'},
                'elem': [
                    {'text': 'The Title'}
                ]
            },
            {
                'html': 'ul',
                'attr': null,
                'elem': [
                    {
                        'html': 'li',
                        'elem': [
                            {
                                'html': 'h2',
                                'attr': {'id': 'the-title4'},
                                'elem': [
                                    {'text': 'The Title'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    );
});


test('markdownElementsAsync, duplicate header IDs with usedHeaderIds option', async () => {
    const elements = await markdownElementsAsync(
        validateMarkdownModel({
            'parts': [
                {
                    'paragraph': {
                        'style': 'h1',
                        'spans': [
                            {'text': 'The Title'}
                        ]
                    }
                },
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {
                                        'paragraph': {
                                            'style': 'h2',
                                            'spans': [
                                                {'text': 'The Title'}
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }),
        {
            'headerIds': true,
            'usedHeaderIds': new Set(['the-title', 'the-title2'])
        }
    );
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'h1',
                'attr': {'id': 'the-title3'},
                'elem': [
                    {'text': 'The Title'}
                ]
            },
            {
                'html': 'ul',
                'attr': null,
                'elem': [
                    {
                        'html': 'li',
                        'elem': [
                            {
                                'html': 'h2',
                                'attr': {'id': 'the-title4'},
                                'elem': [
                                    {'text': 'The Title'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    );
});


test('markdownElements, line break', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'text': 'This is a line break'},
                        {'br': 1},
                        {'text': 'some more text'}
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'p',
                'elem': [
                    {'text': 'This is a line break'},
                    {'html': 'br'},
                    {'text': 'some more text'}
                ]
            }
        ]
    );
});


test('markdownElements, horizontal rule', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {'paragraph': {'spans': [{'text': 'Some text'}]}},
            {'hr': 1},
            {'paragraph': {'spans': [{'text': 'More text'}]}}
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {'html': 'p', 'elem': [{'text': 'Some text'}]},
            {'html': 'hr'},
            {'html': 'p', 'elem': [{'text': 'More text'}]}
        ]
    );
});


test('markdownElements, link span with no title', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'link': {
                            'href': 'https://craigahobbs.github.io/schema-markdown/doc/',
                            'spans': [{'text': 'Type Model'}]
                        }}
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'p',
                'elem': [
                    {
                        'html': 'a',
                        'attr': {'href': 'https://craigahobbs.github.io/schema-markdown/doc/'},
                        'elem': [{'text': 'Type Model'}]
                    }
                ]
            }
        ]
    );
});


test('markdownElements, image span with no title', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'image': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'alt': 'Schema Markdown Documentation Icon'
                        }}
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'p',
                'elem': [
                    {
                        'html': 'img',
                        'attr': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'alt': 'Schema Markdown Documentation Icon',
                            'style': 'max-width: 100%;'
                        }
                    }
                ]
            }
        ]
    );
});


test('markdownElements, link reference', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'linkRef': {
                            'spans': [
                                {'text': '[foo]'}
                            ]
                        }}
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'p',
                'elem': [
                    {'text': '[foo]'}
                ]
            }
        ]
    );
});


test('markdownElements, code span', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'text': 'This is code: '},
                        {'code': 'foo'}
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'p',
                'elem': [
                    {'text': 'This is code: '},
                    {'html': 'code', 'elem': {'text': 'foo'}}
                ]
            }
        ]
    );
});


test('markdownElements, code block with language', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'codeBlock': {
                    'language': 'javascript',
                    'lines': [
                        'foo();',
                        'bar();'
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            [
                null,
                {
                    'html': 'pre',
                    'attr': null,
                    'elem': {
                        'html': 'code',
                        'elem': [
                            {'text': 'foo();\nbar();\n'}
                        ]
                    }
                }
            ]
        ]
    );
});


test('markdownElements, code block with language override', () => {
    const codeBlocks = {
        'fooscript': (codeBlock) => ({'text': `${codeBlock.language}, ${JSON.stringify(codeBlock.lines)}`})
    };
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'codeBlock': {
                    'language': 'fooscript',
                    'lines': [
                        'foo();',
                        'bar();'
                    ]
                }
            }
        ]
    }), {'codeBlocks': codeBlocks});
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {'text': 'fooscript, ["foo();","bar();"]'}
        ]
    );
});


test('markdownElements, table', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'table': {
                    'headers': [[{'text': 'Column A'}], [{'text': 'Column B'}]],
                    'aligns': ['left', 'right'],
                    'rows': [
                        [[{'text': 'A0'}], [{'text': 'B0'}]],
                        [[{'text': 'A1'}], [{'text': 'B1'}]]
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'table',
                'elem': [
                    {
                        'html': 'thead',
                        'elem': {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'Column A'}]},
                                {'html': 'th', 'attr': {'style': 'text-align: right'}, 'elem': [{'text': 'Column B'}]}
                            ]
                        }
                    },
                    {
                        'html': 'tbody',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'A0'}]},
                                    {'html': 'td', 'attr': {'style': 'text-align: right'}, 'elem': [{'text': 'B0'}]}
                                ]
                            },
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'A1'}]},
                                    {'html': 'td', 'attr': {'style': 'text-align: right'}, 'elem': [{'text': 'B1'}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    );
});


test('markdownElements, table no rows', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'table': {
                    'headers': [[{'text': 'Column A'}]],
                    'aligns': ['left']
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'table',
                'elem': [
                    {
                        'html': 'thead',
                        'elem': {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'Column A'}]}
                            ]
                        }
                    },
                    null
                ]
            }
        ]
    );
});


test('markdownElements, table missing align', () => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'table': {
                    'headers': [[{'text': 'Column A'}], [{'text': 'Column B'}]],
                    'aligns': ['left'],
                    'rows': [
                        [[{'text': 'A0'}], [{'text': 'B0'}]]
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    assert.deepEqual(
        elements,
        [
            {
                'html': 'table',
                'elem': [
                    {
                        'html': 'thead',
                        'elem': {
                            'html': 'tr',
                            'elem': [
                                {'html': 'th', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'Column A'}]},
                                {'html': 'th', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'Column B'}]}
                            ]
                        }
                    },
                    {
                        'html': 'tbody',
                        'elem': [
                            {
                                'html': 'tr',
                                'elem': [
                                    {'html': 'td', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'A0'}]},
                                    {'html': 'td', 'attr': {'style': 'text-align: left'}, 'elem': [{'text': 'B0'}]}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    );
});


test('markdownElements, relative and absolute URLs', () => {
    const markdown = validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'link': {
                            'href': 'https://craigahobbs.github.io/schema-markdown/doc/',
                            'spans': [{'text': 'Absolute link URL'}]
                        }},
                        {'link': {
                            'href': 'mailto:johndoe@gmail.com',
                            'spans': [{'text': 'Email absolute URL'}]
                        }},
                        {'link': {
                            'href': '/schema-markdown/doc/',
                            'spans': [{'text': 'Absolute link URL without scheme'}]
                        }},
                        {'link': {
                            'href': '#',
                            'spans': [{'text': 'Top link'}]
                        }},
                        {'link': {
                            'href': '#anchor',
                            'spans': [{'text': 'Anchor link'}]
                        }},
                        {'link': {
                            'href': '#foo=bar',
                            'spans': [{'text': 'Page link'}]
                        }},
                        {'link': {
                            'href': '#foo=bar&url=bar.md',
                            'spans': [{'text': 'Page link with url param'}]
                        }},
                        {'link': {
                            'href': '?foo=bar',
                            'spans': [{'text': 'Query string'}]
                        }},
                        {'link': {
                            'href': 'doc/',
                            'spans': [{'text': 'Relative link URL'}]
                        }},
                        {'image': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'alt': 'Absolute image URL'
                        }},
                        {'image': {
                            'src': 'doc.svg',
                            'alt': 'Relative image URL'
                        }}
                    ]
                }
            }
        ]
    });

    // Default elements
    const defaultElements = [
        {
            'elem': [
                {
                    'attr': {'href': 'https://craigahobbs.github.io/schema-markdown/doc/'},
                    'elem': [{'text': 'Absolute link URL'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': 'mailto:johndoe@gmail.com'},
                    'elem': [{'text': 'Email absolute URL'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': '/schema-markdown/doc/'},
                    'elem': [{'text': 'Absolute link URL without scheme'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': '#'},
                    'elem': [{'text': 'Top link'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': '#anchor'},
                    'elem': [{'text': 'Anchor link'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': '#foo=bar'},
                    'elem': [{'text': 'Page link'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': '#foo=bar&url=bar.md'},
                    'elem': [{'text': 'Page link with url param'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': '?foo=bar'},
                    'elem': [{'text': 'Query string'}],
                    'html': 'a'
                },
                {
                    'attr': {'href': 'doc/'},
                    'elem': [{'text': 'Relative link URL'}],
                    'html': 'a'
                },
                {
                    'attr': {
                        'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                        'alt': 'Absolute image URL',
                        'style': 'max-width: 100%;'
                    },
                    'html': 'img'
                },
                {
                    'attr': {
                        'src': 'doc.svg',
                        'alt': 'Relative image URL',
                        'style': 'max-width: 100%;'
                    },
                    'html': 'img'
                }
            ],
            'html': 'p'
        }
    ];

    // Test without options
    const elements = markdownElements(markdown);
    validateElements(elements);
    assert.deepEqual(elements, defaultElements);

    // Test with urlFn option - relative file fixup
    const rNotRelativeURL = /^(?:[a-z]+:|\/|\?|#)/;
    const isRelativeURL = (url) => !rNotRelativeURL.test(url);
    const elementsURL = markdownElements(markdown, {
        'urlFn': (url) => (isRelativeURL(url) ? `https://foo.com/${url}` : url)
    });
    validateElements(elementsURL);
    assert.deepEqual(
        elementsURL,
        [
            {
                'elem': [
                    {
                        'attr': {'href': 'https://craigahobbs.github.io/schema-markdown/doc/'},
                        'elem': [{'text': 'Absolute link URL'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': 'mailto:johndoe@gmail.com'},
                        'elem': [{'text': 'Email absolute URL'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': '/schema-markdown/doc/'},
                        'elem': [{'text': 'Absolute link URL without scheme'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': '#'},
                        'elem': [{'text': 'Top link'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': '#anchor'},
                        'elem': [{'text': 'Anchor link'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': '#foo=bar'},
                        'elem': [{'text': 'Page link'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': '#foo=bar&url=bar.md'},
                        'elem': [{'text': 'Page link with url param'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': '?foo=bar'},
                        'elem': [{'text': 'Query string'}],
                        'html': 'a'
                    },
                    {
                        'attr': {'href': 'https://foo.com/doc/'},
                        'elem': [{'text': 'Relative link URL'}],
                        'html': 'a'
                    },
                    {
                        'attr': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'alt': 'Absolute image URL',
                            'style': 'max-width: 100%;'
                        },
                        'html': 'img'
                    },
                    {
                        'attr': {
                            'src': 'https://foo.com/doc.svg',
                            'alt': 'Relative image URL',
                            'style': 'max-width: 100%;'
                        },
                        'html': 'img'
                    }
                ],
                'html': 'p'
            }
        ]
    );
});
