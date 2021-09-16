// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {markdownElements, validateMarkdownModel} from '../markdown-model/index.js';
import test from 'ava';
import {validateElements} from 'element-model/index.js';


test('markdownElements', (t) => {
    const elements = markdownElements(validateMarkdownModel({
        'parts': [
            {'paragraph': {'style': 'h1', 'spans': [{'text': 'Title'}]}},
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
            {'html': 'h1', 'elem': [{'text': 'Title'}]},
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
        'fooscript': (language, lines) => ({'text': `${language}, ${JSON.stringify(lines)}`})
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
                            'href': '#anchor',
                            'spans': [{'text': 'Anchor link'}]
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

    // Test without file URL
    const elements = markdownElements(markdown);
    validateElements(elements);
    t.deepEqual(
        elements,
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
                        'attr': {'href': '#anchor'},
                        'elem': [{'text': 'Anchor link'}],
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
        ]
    );

    // Test with file URL
    const elementsURL = markdownElements(markdown, {'url': 'https://foo.com/index.md'});
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
                        'attr': {'href': '#anchor'},
                        'elem': [{'text': 'Anchor link'}],
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
