// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {
    escapeMarkdownText, escapeMarkdownURL, escapeMarkdownURLComponent, getBaseURL, isRelativeURL, markdownElements, markdownElementsAsync
} from '../lib/elements.js';
import test from 'ava';
import {validateElements} from 'element-model/lib/elementModel.js';
import {validateMarkdownModel} from '../lib/model.js';


test('markdownElements', (t) => {
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
                        }
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
    t.deepEqual(
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
                    ]}
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
                            'alt': 'Schema Markdown Documentation Icon'
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
                'html': 'pre',
                'elem': {
                    'html': 'code',
                    'elem': [
                        {'text': 'Line 1\n'},
                        {'text': 'Line 2\n'}
                    ]
                }
            }
        ]
    );
});


test('markdownElementsAsync', async (t) => {
    const elements = await markdownElementsAsync(
        validateMarkdownModel({
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'The Title'}]}},
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {
                                        'codeBlock': {
                                            'lines': [
                                                'Line 1',
                                                'Line 2'
                                            ]
                                        }
                                    },
                                    {
                                        'codeBlock': {
                                            'language': 'async-code-block',
                                            'lines': [
                                                'Line 1',
                                                'Line 2'
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
    t.deepEqual(
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
                            {
                                'html': 'pre',
                                'elem': {
                                    'html': 'code',
                                    'elem': [
                                        {'text': 'Line 1\n'},
                                        {'text': 'Line 2\n'}
                                    ]
                                }
                            },
                            {
                                'html': 'p',
                                'elem': {'text': 'Line 1, Line 2'}
                            }
                        ]
                    }
                ]
            }
        ]
    );
});


test('markdownElements, header IDs', (t) => {
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
    t.deepEqual(
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


test('markdownElements, header IDs urlFn', (t) => {
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
    t.deepEqual(
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


test('markdownElements, duplicate header IDs', (t) => {
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
    t.deepEqual(
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


test('markdownElements, duplicate header IDs with usedHeaderIds option', (t) => {
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
    t.deepEqual(
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


test('markdownElementsAsync, duplicate header IDs with usedHeaderIds option', async (t) => {
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
    t.deepEqual(
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


test('markdownElements, line break', (t) => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {
                'paragraph': {
                    'spans': [
                        {'text': 'This is a line break'},
                        {'br': null},
                        {'text': 'some more text'}
                    ]
                }
            }
        ]
    }));
    validateElements(elements);
    t.deepEqual(
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


test('markdownElements, horizontal rule', (t) => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {'paragraph': {'spans': [{'text': 'Some text'}]}},
            {'hr': null},
            {'paragraph': {'spans': [{'text': 'More text'}]}}
        ]
    }));
    validateElements(elements);
    t.deepEqual(
        elements,
        [
            {'html': 'p', 'elem': [{'text': 'Some text'}]},
            {'html': 'hr'},
            {'html': 'p', 'elem': [{'text': 'More text'}]}
        ]
    );
});


test('markdownElements, link span with no title', (t) => {
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
    t.deepEqual(
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


test('markdownElements, image span with no title', (t) => {
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
    t.deepEqual(
        elements,
        [
            {
                'html': 'p',
                'elem': [
                    {
                        'html': 'img',
                        'attr': {
                            'src': 'https://craigahobbs.github.io/schema-markdown/doc/doc.svg',
                            'alt': 'Schema Markdown Documentation Icon'
                        }
                    }
                ]
            }
        ]
    );
});


test('markdownElements, code block with language', (t) => {
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
    t.deepEqual(
        elements,
        [
            {
                'html': 'pre',
                'elem': {
                    'html': 'code',
                    'elem': [
                        {'text': 'foo();\n'},
                        {'text': 'bar();\n'}
                    ]
                }
            }
        ]
    );
});


test('markdownElements, code block with language override', (t) => {
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
    t.deepEqual(
        elements,
        [
            {'text': 'fooscript, ["foo();","bar();"]'}
        ]
    );
});


test('markdownElements, relative and absolute URLs', (t) => {
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
                        'alt': 'Absolute image URL'
                    },
                    'html': 'img'
                },
                {
                    'attr': {
                        'src': 'doc.svg',
                        'alt': 'Relative image URL'
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
    t.deepEqual(elements, defaultElements);

    // Test with urlFn option - relative file fixup
    const elementsURL = markdownElements(markdown, {
        'urlFn': (url) => (isRelativeURL(url) ? getBaseURL('https://foo.com/index.md') + url : url)
    });
    validateElements(elementsURL);
    t.deepEqual(
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
                            'alt': 'Absolute image URL'
                        },
                        'html': 'img'
                    },
                    {
                        'attr': {
                            'src': 'https://foo.com/doc.svg',
                            'alt': 'Relative image URL'
                        },
                        'html': 'img'
                    }
                ],
                'html': 'p'
            }
        ]
    );
});


test('escapeMarkdownText', (t) => {
    t.is(escapeMarkdownText('Escape me: \\ [ ] ( ) *'), 'Escape me: \\\\ \\[ \\] \\( \\) \\*');
});


test('escapeMarkdownURL', (t) => {
    t.is(escapeMarkdownURL('https://foo.com/a & b.html'), 'https://foo.com/a%20&%20b.html');
    t.is(escapeMarkdownURL('https://foo.com/a (& b).html'), 'https://foo.com/a%20(&%20b%29.html');
});


test('escapeMarkdownURLComponent', (t) => {
    t.is(escapeMarkdownURLComponent('https://foo.com/a & b.html'), 'https%3A%2F%2Ffoo.com%2Fa%20%26%20b.html');
    t.is(escapeMarkdownURLComponent('https://foo.com/a (& b).html'), 'https%3A%2F%2Ffoo.com%2Fa%20(%26%20b%29.html');
});
