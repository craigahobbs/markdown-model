// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {parseMarkdown} from '../lib/parser.js';
import test from 'ava';
import {validateMarkdownModel} from '../lib/model.js';


test('parseMarkdown, spans', (t) => {
    const markdown = parseMarkdown(`\
These are some basic styles: **bold**, *italic*, ***bold-italic***.

This is a [link](https://foo.com) and so is [this](https://bar.com "Bar").

This is another link: <https://foo.com>

This is an ![image](https://foo.com/foo.jpg) and so is ![this](https://bar.com/bar.jpg "Bar").

This is code \`foo = 2 * bar\`.
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'These are some basic styles: '},
                        {'style': {'style': 'bold', 'spans': [{'text': 'bold'}]}},
                        {'text': ', '},
                        {'style': {'style': 'italic', 'spans': [{'text': 'italic'}]}},
                        {'text': ', '},
                        {'style': {'spans': [{'style': {'spans': [{'text': 'bold-italic'}], 'style': 'italic'}}], 'style': 'bold'}},
                        {'text': '.'}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'This is a '},
                        {'link': {'href': 'https://foo.com', 'spans': [{'text': 'link'}]}},
                        {'text': ' and so is '},
                        {'link': {'href': 'https://bar.com', 'spans': [{'text': 'this'}], 'title': 'Bar'}},
                        {'text': '.'}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'This is another link: '},
                        {'link': {'href': 'https://foo.com', 'spans': [{'text': 'https://foo.com'}]}}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'This is an '},
                        {'image': {'alt': 'image', 'src': 'https://foo.com/foo.jpg'}},
                        {'text': ' and so is '},
                        {'image': {'alt': 'this', 'src': 'https://bar.com/bar.jpg', 'title': 'Bar'}},
                        {'text': '.'}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'This is code '},
                        {'code': 'foo = 2 * bar'},
                        {'text': '.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, nested spans', (t) => {
    const markdown = parseMarkdown(`\
This is a [link **with *formatting***](https://foo.com)
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This is a '},
                        {
                            'link': {
                                'href': 'https://foo.com',
                                'spans': [
                                    {'text': 'link '},
                                    {'style': {'style': 'bold', 'spans': [
                                        {'text': 'with '},
                                        {'style': {'style': 'italic', 'spans': [{'text': 'formatting'}]}}
                                    ]}}
                                ]
                            }
                        }
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, spans spaces', (t) => {
    const markdown = parseMarkdown(`\
***no *** *** no*** **no ** ** no** *no * * no*
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'style': 'bold', 'spans': [{'text': '*no *'}]}},
                        {'text': ' *** no*** '},
                        {'style': {'style': 'bold', 'spans': [{'text': 'no ** ** no'}]}},
                        {'text': ' '},
                        {'style': {'style': 'italic', 'spans': [{'text': 'no * * no'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, entity references', (t) => {
    const markdown = parseMarkdown(`\
&nbsp; &amp; &copy; &AElig; &Dcaron;
&frac34; &HilbertSpace; &DifferentialD;
&ClockwiseContourIntegral; &ngE;
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': `\
\xa0 & \xa9 &AElig; &Dcaron;
\xbe &HilbertSpace; &DifferentialD;
&ClockwiseContourIntegral; &ngE;`}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, entity decimal numeric character references', (t) => {
    const markdown = parseMarkdown('&#35; &#1234; &#992; &#0;');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\x23 \u04d2 \u03e0 \0'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, entity hex numeric character references', (t) => {
    const markdown = parseMarkdown('&#X22; &#XD06; &#xcab;');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\x22 \u0d06 \u0cab'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, entity non-entities', (t) => {
    const markdown = parseMarkdown(`\
&nbsp &x; &#; &#x;
&#87654321;
&#abcdef0;
&ThisIsNotDefined; &hi?;
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': `\
&nbsp &x; &#; &#x;
&#87654321;
&#abcdef0;
&ThisIsNotDefined; &hi?;`}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic', (t) => {
    const markdown = parseMarkdown('*foo bar*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic multiline', (t) => {
    const markdown = parseMarkdown('*text\ntext*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'text\ntext'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic escape start', (t) => {
    const markdown = parseMarkdown('\\*foo bar*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\\'},
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic escape end', (t) => {
    const markdown = parseMarkdown('*foo bar\\*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '*foo bar*'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic mismatched', (t) => {
    const markdown = parseMarkdown('*foo_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '*foo_'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic internal', (t) => {
    const markdown = parseMarkdown('foo*bar*baz');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}},
                        {'text': 'baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic internal start', (t) => {
    const markdown = parseMarkdown('*foo*bar');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'foo'}], 'style': 'italic'}},
                        {'text': 'bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic internal end', (t) => {
    const markdown = parseMarkdown('foo*bar*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic sentence end', (t) => {
    const markdown = parseMarkdown('*bar*.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}},
                        {'text': '.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic character', (t) => {
    const markdown = parseMarkdown('*\\**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '*'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic whitespace', (t) => {
    const markdown = parseMarkdown('a * foo bar*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'a * foo bar*'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic whitespace 2', (t) => {
    const markdown = parseMarkdown('a *foo bar *');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'a *foo bar *'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic whitespace 3', (t) => {
    const markdown = parseMarkdown('a *foo bar\n*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'a *foo bar\n*'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic non-breaking space', (t) => {
    const markdown = parseMarkdown(`foo *${String.fromCharCode(160)}a${String.fromCharCode(160)}*`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': `foo *${String.fromCharCode(160)}a${String.fromCharCode(160)}*`}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic', (t) => {
    const markdown = parseMarkdown('_foo bar_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic multiline', (t) => {
    const markdown = parseMarkdown('_text\ntext_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'text\ntext'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic escape start', (t) => {
    const markdown = parseMarkdown('\\_foo bar_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\\'},
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic escape end', (t) => {
    const markdown = parseMarkdown('_foo bar\\_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '_foo bar_'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic mismatched', (t) => {
    const markdown = parseMarkdown('_foo*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '_foo*'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic internal', (t) => {
    const markdown = parseMarkdown('foo_bar_baz');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo_bar_baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic internal start', (t) => {
    const markdown = parseMarkdown('_foo_bar');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '_foo_bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic internal end', (t) => {
    const markdown = parseMarkdown('foo_bar_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic sentence end', (t) => {
    const markdown = parseMarkdown('_bar_.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}},
                        {'text': '.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic character', (t) => {
    const markdown = parseMarkdown('_\\__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '_'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, uderscore italic whitespace', (t) => {
    const markdown = parseMarkdown('a _ foo bar_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'a _ foo bar_'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, uderscore italic whitespace 2', (t) => {
    const markdown = parseMarkdown('a _foo bar _');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'a _foo bar _'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, uderscore italic whitespace 3', (t) => {
    const markdown = parseMarkdown('a _foo bar\n_');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'a _foo bar\n_'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore italic non-breaking space', (t) => {
    const markdown = parseMarkdown(`foo _${String.fromCharCode(160)}a${String.fromCharCode(160)}_`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': `foo _${String.fromCharCode(160)}a${String.fromCharCode(160)}_`}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold', (t) => {
    const markdown = parseMarkdown('**foo bar**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold multiline', (t) => {
    const markdown = parseMarkdown('**text\ntext**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'text\ntext'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold escape end', (t) => {
    const markdown = parseMarkdown('**foo bar\\**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '*foo bar*'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold mismatched', (t) => {
    const markdown = parseMarkdown('**foo bar__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '**foo bar__'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold internal', (t) => {
    const markdown = parseMarkdown('foo**bar**baz');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                        {'text': 'baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold internal start', (t) => {
    const markdown = parseMarkdown('**foo**bar');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'foo'}], 'style': 'bold'}},
                        {'text': 'bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold internal end', (t) => {
    const markdown = parseMarkdown('foo**bar**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold sentence end', (t) => {
    const markdown = parseMarkdown('**bar**.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                        {'text': '.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold character', (t) => {
    const markdown = parseMarkdown('**\\***');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '*'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold nested', (t) => {
    const markdown = parseMarkdown('****foo****');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'spans': [
                                {'style': {'spans': [{'text': 'foo'}], 'style': 'bold'}}
                            ],
                            'style': 'bold'
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold whitespace', (t) => {
    const markdown = parseMarkdown('** foo bar**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '** foo bar**'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold whitespace 2', (t) => {
    const markdown = parseMarkdown('**foo bar **');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '*foo bar *'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold whitespace 3', (t) => {
    const markdown = parseMarkdown('**foo bar\n**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '*foo bar\n*'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold', (t) => {
    const markdown = parseMarkdown('__foo bar__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold multiline', (t) => {
    const markdown = parseMarkdown('__text\ntext__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'text\ntext'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold escape end', (t) => {
    const markdown = parseMarkdown('__foo bar\\__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '_foo bar_'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold mismatched', (t) => {
    const markdown = parseMarkdown('__foo bar**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '__foo bar**'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold internal', (t) => {
    const markdown = parseMarkdown('foo__bar__baz');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo__bar__baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold internal start', (t) => {
    const markdown = parseMarkdown('__foo__bar');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '__foo__bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold internal end', (t) => {
    const markdown = parseMarkdown('foo__bar__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold sentence end', (t) => {
    const markdown = parseMarkdown('__bar__.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                        {'text': '.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold character', (t) => {
    const markdown = parseMarkdown('__\\___');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '_'}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold nested', (t) => {
    const markdown = parseMarkdown('____foo____');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'spans': [
                                {'style': {'spans': [{'text': 'foo'}], 'style': 'bold'}}
                            ],
                            'style': 'bold'
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold whitespace', (t) => {
    const markdown = parseMarkdown('__ foo bar__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '__ foo bar__'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold whitespace 2', (t) => {
    const markdown = parseMarkdown('__foo bar __');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '_foo bar _'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold whitespace 3', (t) => {
    const markdown = parseMarkdown('__foo bar\n__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '_foo bar\n_'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold-italic', (t) => {
    const markdown = parseMarkdown('***foo***');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [
                    {'style': {
                        'spans': [
                            {'style': {'spans': [{'text': 'foo'}], 'style': 'italic'}}
                        ],
                        'style': 'bold'
                    }}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, bold-italic multiline', (t) => {
    const markdown = parseMarkdown('***text\ntext***');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'spans': [
                                {'style': {'spans': [{'text': 'text\ntext'}], 'style': 'italic'}}
                            ],
                            'style': 'bold'
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, underscore bold-italic', (t) => {
    const markdown = parseMarkdown('___foo___');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [
                    {'style': {
                        'spans': [
                            {'style': {'spans': [{'text': 'foo'}], 'style': 'italic'}}
                        ],
                        'style': 'bold'
                    }}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, underscore bold-italic multiline', (t) => {
    const markdown = parseMarkdown('___text\ntext___');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'spans': [
                                {'style': {'spans': [{'text': 'text\ntext'}], 'style': 'italic'}}
                            ],
                            'style': 'bold'
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold in italic', (t) => {
    const markdown = parseMarkdown('***strong** in emph*');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': '*strong'}], 'style': 'bold'}},
                        {'text': ' in emph*'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold in italic 2', (t) => {
    const markdown = parseMarkdown('*in emph **strong***');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'text': 'in emph *'}], 'style': 'italic'}},
                        {'text': 'strong'},
                        {'style': {'spans': [{'text': '*'}], 'style': 'italic'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic in bold', (t) => {
    const markdown = parseMarkdown('***emph* in strong**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'spans': [
                                {'style': {'spans': [{'text': 'emph'}], 'style': 'italic'}},
                                {'text': ' in strong'}
                            ],
                            'style': 'bold'
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, italic in bold 2', (t) => {
    const markdown = parseMarkdown('**in strong *emph***');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'spans': [
                                {'text': 'in strong '},
                                {'style': {'spans': [{'text': 'emph'}], 'style': 'italic'}}
                            ],
                            'style': 'bold'
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough', (t) => {
    const markdown = parseMarkdown('~~Hi~~ Hello, ~there~ world!');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'style': 'strikethrough', 'spans': [{'text': 'Hi'}]}},
                        {'text': ' Hello, '},
                        {'style': {'style': 'strikethrough', 'spans': [{'text': 'there'}]}},
                        {'text': ' world!'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough multiline', (t) => {
    const markdown = parseMarkdown('~~foo\nbar~~');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'style': 'strikethrough', 'spans': [{'text': 'foo\nbar'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough escape start', (t) => {
    const markdown = parseMarkdown('\\~foo bar~');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\\'},
                        {'style': {'style': 'strikethrough', 'spans': [{'text': 'foo bar'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough escape start 2', (t) => {
    const markdown = parseMarkdown('\\~~foo bar~');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '~'},
                        {'style': {'style': 'strikethrough', 'spans': [{'text': 'foo bar'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough escape end', (t) => {
    const markdown = parseMarkdown('~foo bar\\~');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '~foo bar~'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough not', (t) => {
    const markdown = parseMarkdown('This will ~~~not~~~ strike.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This will ~~~not~~~ strike.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough not 2', (t) => {
    const markdown = parseMarkdown('This will ~~~not~~ strike.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This will ~'},
                        {'style': {'style': 'strikethrough', 'spans': [{'text': 'not'}]}},
                        {'text': ' strike.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, strikethrough not 3', (t) => {
    const markdown = parseMarkdown('This will ~~not~~~ strike.');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This will ~~not~~~ strike.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span', (t) => {
    const markdown = parseMarkdown('This is code: `foo`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This is code: '},
                        {'code': 'foo'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span multiple', (t) => {
    const markdown = parseMarkdown('This is code: ``foo ` bar``');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This is code: '},
                        {'code': 'foo ` bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span strip space pad', (t) => {
    const markdown = parseMarkdown('` `` `');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': '``'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span strip space pad with extra spaces', (t) => {
    const markdown = parseMarkdown('`  ``  `');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': ' `` '}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span begin space', (t) => {
    const markdown = parseMarkdown('` a`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': ' a'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span end space', (t) => {
    const markdown = parseMarkdown('`a `');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'a '}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span tab padding', (t) => {
    const markdown = parseMarkdown('`\ta\t`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': '   a   '}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span only spaces', (t) => {
    const markdown = parseMarkdown('` `\n`  `');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': '` ` '}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span multiline text', (t) => {
    const markdown = parseMarkdown('`foo\nbar  \nbaz\n`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'foo bar   baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span multiline text last line end space', (t) => {
    const markdown = parseMarkdown('`foo \n`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'foo '}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span backslash', (t) => {
    const markdown = parseMarkdown('`foo\\`bar`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'foo\\'},
                        {'text': 'bar`'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span large delimeter', (t) => {
    const markdown = parseMarkdown('``foo`bar``');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'foo`bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span small delimeter', (t) => {
    const markdown = parseMarkdown('`foo``bar`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'foo``bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span order', (t) => {
    const markdown = parseMarkdown('*foo`*`');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {
                            'style': {
                                'style': 'italic',
                                'spans': [
                                    {'text': 'foo`'}
                                ]
                            }
                        },
                        {'text': '`'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span mismatched', (t) => {
    const markdown = parseMarkdown('This is code: ```foo``');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This is code: `'},
                        {'code': 'foo'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code span mismatched 2', (t) => {
    const markdown = parseMarkdown('`foo``bar``');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'foo``bar`'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break', (t) => {
    const markdown = parseMarkdown(`\
This is a line break${'  '}
  this is not
and this is not${'  '}

This is another paragraph.
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'This is a line break'},
                        {'br': 1},
                        {'text': '  this is not\nand this is not  '}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'This is another paragraph.'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break backslash', (t) => {
    const markdown = parseMarkdown(`\
foo\\
baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'br': 1},
                        {'text': 'baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break several spaces', (t) => {
    const markdown = parseMarkdown(`\
foo${'       '}
baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'br': 1},
                        {'text': 'baz'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break next line space', (t) => {
    const markdown = parseMarkdown(`\
foo${'  '}
     bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'br': 1},
                        {'text': '     bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break backslash next line space', (t) => {
    const markdown = parseMarkdown(`\
foo\\
     bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'},
                        {'br': 1},
                        {'text': '     bar'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break inline', (t) => {
    const markdown = parseMarkdown(`\
*foo${'  '}
bar*
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {
                            'style': 'italic',
                            'spans': [
                                {'text': 'foo'},
                                {'br': 1},
                                {'text': 'bar'}
                            ]
                        }}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break not inline code', (t) => {
    const markdown = parseMarkdown(`\
\`code${'  '}
span\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': 'code   span'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line break not paragraph end', (t) => {
    const markdown = parseMarkdown(`\
foo\\

foo${'  '}

### foo\\

### foo${'  '}
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'foo\\'}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'foo  '}
                    ]
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'foo\\'}
                    ],
                    'style': 'h3'
                }},
                {'paragraph': {
                    'spans': [
                        {'text': 'foo'}
                    ],
                    'style': 'h3'
                }}
            ]
        }
    );
});


test('parseMarkdown, escapes', (t) => {
    const markdown = parseMarkdown(`\
\\!\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\_\\\`\\{\\|\\}\\~
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, escapes 2', (t) => {
    const markdown = parseMarkdown('\\\\ \\* \\_ \\{ \\} \\[ \\] **bol\\.d** \\( \\) \\# \\+ \\- \\. \\! \\a');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\\ * _ { } [ ] '},
                        {'style': {'style': 'bold', 'spans': [{'text': 'bol.d'}]}},
                        {'text': ' ( ) # + - . ! a'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, escapes not in code spans', (t) => {
    const markdown = parseMarkdown('`` \\[\\` ``');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'code': '\\[\\`'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, escapes not in code blocks', (t) => {
    const markdown = parseMarkdown('    \\[\\]');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {
                    'lines': ['\\[\\]'],
                    'startLineNumber': 1
                }}
            ]
        }
    );
});


test('parseMarkdown, escapes not in fenced code blocks', (t) => {
    const markdown = parseMarkdown(`\
~~~
\\[\\]
~~~
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {
                    'lines': ['\\[\\]'],
                    'startLineNumber': 1
                }}
            ]
        }
    );
});


test('parseMarkdown, escapes not in autolinks', (t) => {
    const markdown = parseMarkdown('<http://example.com?find=\\*>');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [
                    {'link': {
                        'href': 'http://example.com?find=\\*',
                        'spans': [{'text': 'http://example.com?find=\\*'}]
                    }}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, link', (t) => {
    const markdown = parseMarkdown('[link](/uri "title")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/uri', 'spans': [{'text': 'link'}], 'title': 'title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link no title', (t) => {
    const markdown = parseMarkdown('[link](/uri)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/uri', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link empty', (t) => {
    const markdown = parseMarkdown('[link]()');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href space', (t) => {
    const markdown = parseMarkdown('[link](/my uri)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': '(/my uri)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href no newlines', (t) => {
    const markdown = parseMarkdown('[link](foo\nbar)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': '(foo\nbar)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href escape', (t) => {
    const markdown = parseMarkdown('[link](\\(foo\\))');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '(foo)', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href parentheses', (t) => {
    const markdown = parseMarkdown('[link](foo(and(bar)))');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'foo(and(bar', 'spans': [{'text': 'link'}]}},
                        {'text': '))'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href parentheses escaped', (t) => {
    const markdown = parseMarkdown('[link](foo\\(and\\(bar\\))');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'foo(and(bar)', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href parentheses escaped 2', (t) => {
    const markdown = parseMarkdown('[link](foo\\)\\:)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'foo):', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href parentheses not escaped', (t) => {
    const markdown = parseMarkdown('[link](foo\\bar)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'foo\\bar', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href entity', (t) => {
    const markdown = parseMarkdown('[link](foo%20b&#228;)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': `foo%20b${String.fromCharCode(228)}`, 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href empty', (t) => {
    const markdown = parseMarkdown('[link](<>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href space', (t) => {
    const markdown = parseMarkdown('[link](</my uri>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/my uri', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href no newlines', (t) => {
    const markdown = parseMarkdown('[link](<foo\nbar>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': '(<foo\nbar>)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href parenthesis', (t) => {
    const markdown = parseMarkdown('[a](<b)c>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'b)c', 'spans': [{'text': 'a'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href parentheses 2', (t) => {
    const markdown = parseMarkdown('[link](<foo(and(bar)>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'foo(and(bar)', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href escape', (t) => {
    const markdown = parseMarkdown('[link](<foo\\>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': '(<foo>)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link angle href not matched', (t) => {
    const markdown = parseMarkdown(`\
[a](<b)c
[a](<b)c>
[a](<b>c)
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[a]'}]}},
                        {'text': '(<b)c\n'},
                        {'linkRef': {'spans': [{'text': '[a]'}]}},
                        {'text': '(<b)c>\n'},
                        {'linkRef': {'spans': [{'text': '[a]'}]}},
                        {'text': '(<b>c)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link title with no href', (t) => {
    const markdown = parseMarkdown('[link]("title")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '"title"', 'spans': [{'text': 'link'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link title variations', (t) => {
    const markdown = parseMarkdown(`\
[link](/url "title")
[link](/url 'title')
[link](/url (title))
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/url', 'spans': [{'text': 'link'}], 'title': 'title'}},
                        {'text': '\n'},
                        {'link': {'href': '/url', 'spans': [{'text': 'link'}], 'title': 'title'}},
                        {'text': '\n'},
                        {'link': {'href': '/url', 'spans': [{'text': 'link'}], 'title': 'title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link title escape', (t) => {
    const markdown = parseMarkdown('[link](/url "title \\"&quot;")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/url', 'spans': [{'text': 'link'}], 'title': 'title ""'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href-title non-breaking space', (t) => {
    const markdown = parseMarkdown(`[link](/url${String.fromCharCode(160)}"title")`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/url', 'spans': [{'text': 'link'}], 'title': 'title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link title not escaped', (t) => {
    const markdown = parseMarkdown(`\
[link](/url "title "and" title")
[link](/url (title )and) title))
[link](/url 'title 'and' title')
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': '(/url "title "and" title")\n'},
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': '(/url (title )and) title))\n'},
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': "(/url 'title 'and' title')"}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link title not escaped work around', (t) => {
    const markdown = parseMarkdown('[link](/url \'title "and" title\')');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/url', 'spans': [{'text': 'link'}], 'title': 'title "and" title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href-title space padding', (t) => {
    const markdown = parseMarkdown(`\
[
  link
  ](
  /uri
  "title"
  )
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/uri', 'spans': [{'text': '\n  link\n  '}], 'title': 'title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link no text-href space', (t) => {
    const markdown = parseMarkdown('[link] (/uri)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': ' (/uri)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link text brackets', (t) => {
    const markdown = parseMarkdown(`\
[link [foo [bar]]](/uri)
[link] bar](/uri)
[link [bar](/uri)
[link \\[bar](/uri)
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'linkRef': {'spans': [{'text': '[link [foo [bar]'}]}},
                        {'text': ']](/uri)\n'},
                        {'linkRef': {'spans': [{'text': '[link]'}]}},
                        {'text': ' bar](/uri)\n'},
                        {'link': {'href': '/uri', 'spans': [{'text': 'link [bar'}]}},
                        {'text': '\n'},
                        {'link': {'href': '/uri', 'spans': [{'text': 'link [bar'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link text spans', (t) => {
    const markdown = parseMarkdown('[link _foo **bar** `#`_](/uri)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/uri', 'spans': [
                            {'text': 'link '},
                            {'style': {
                                'style': 'italic',
                                'spans': [
                                    {'text': 'foo '},
                                    {'style': {'style': 'bold', 'spans': [{'text': 'bar'}]}},
                                    {'text': ' '},
                                    {'code': '#'}
                                ]
                            }}
                        ]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link text spans empty', (t) => {
    const markdown = parseMarkdown('[](/uri)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': '/uri', 'spans': []}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image', (t) => {
    const markdown = parseMarkdown('![foo](/url "title")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'image': {'alt': 'foo', 'src': '/url', 'title': 'title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image no title', (t) => {
    const markdown = parseMarkdown('![foo](/url)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'image': {'alt': 'foo', 'src': '/url'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image spaces', (t) => {
    const markdown = parseMarkdown('My ![foo bar](/path/to/train.jpg  "title"   )');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': 'My '},
                        {'image': {'alt': 'foo bar', 'src': '/path/to/train.jpg', 'title': 'title'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image angle src', (t) => {
    const markdown = parseMarkdown('![foo](<url>)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'image': {'alt': 'foo', 'src': 'url'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image alt empty', (t) => {
    const markdown = parseMarkdown('![](/url)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'image': {'alt': '', 'src': '/url'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image escapes', (t) => {
    const markdown = parseMarkdown('![a\\l\\]t](s\\r\\.c "tit\\l\\.e")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'image': {'alt': 'a\\l]t', 'src': 's\\r.c', 'title': 'tit\\l.e'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link image', (t) => {
    const markdown = parseMarkdown('[![alt](src)](url)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'url', 'spans': [
                            {'image': {'alt': 'alt', 'src': 'src'}}
                        ]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link image titles', (t) => {
    const markdown = parseMarkdown('[![alt](src "imageTitle")](url "linkTitle")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'url', 'title': 'linkTitle', 'spans': [
                            {'image': {'alt': 'alt', 'src': 'src', 'title': 'imageTitle'}}
                        ]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link image spaces', (t) => {
    const markdown = parseMarkdown('[  ![alt](src)  ](url)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'url', 'spans': [
                            {'image': {'alt': 'alt', 'src': 'src'}}
                        ]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link image spaces multiline', (t) => {
    const markdown = parseMarkdown('[  ![alt](src)  ](url)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'url', 'spans': [
                            {'image': {'alt': 'alt', 'src': 'src'}}
                        ]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link alternate', (t) => {
    const markdown = parseMarkdown('<http://foo.bar.baz>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'http://foo.bar.baz', 'spans': [{'text': 'http://foo.bar.baz'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate query', (t) => {
    const markdown = parseMarkdown('<http://foo.bar.baz/test?q=hello&id=22&boolean>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {
                        'href': 'http://foo.bar.baz/test?q=hello&id=22&boolean',
                        'spans': [{'text': 'http://foo.bar.baz/test?q=hello&id=22&boolean'}]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate non-http', (t) => {
    const markdown = parseMarkdown('<irc://foo.bar:2233/baz>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'irc://foo.bar:2233/baz', 'spans': [{'text': 'irc://foo.bar:2233/baz'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate uppercase', (t) => {
    const markdown = parseMarkdown('<MAILTO:FOO@BAR.BAZ>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'MAILTO:FOO@BAR.BAZ', 'spans': [{'text': 'MAILTO:FOO@BAR.BAZ'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate relative', (t) => {
    const markdown = parseMarkdown('<http://../>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'http://../', 'spans': [{'text': 'http://../'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate port', (t) => {
    const markdown = parseMarkdown('<localhost:5001/foo>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'localhost:5001/foo', 'spans': [{'text': 'localhost:5001/foo'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate space', (t) => {
    const markdown = parseMarkdown('<http://foo.bar/baz bim>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '<http://foo.bar/baz bim>'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate space 2', (t) => {
    const markdown = parseMarkdown('< http://foo.bar >');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '< http://foo.bar >'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate no escapes', (t) => {
    const markdown = parseMarkdown('<http://example.com/\\[\\>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'http://example.com/\\[\\', 'spans': [{'text': 'http://example.com/\\[\\'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate invalid scheme', (t) => {
    const markdown = parseMarkdown('<m:abc>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '<m:abc>'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate email', (t) => {
    const markdown = parseMarkdown('<foo@bar.example.com>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'mailto:foo@bar.example.com', 'spans': [{'text': 'mailto:foo@bar.example.com'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate email 2', (t) => {
    const markdown = parseMarkdown('<foo+special@Bar.baz-bar0.com>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': 'mailto:foo+special@Bar.baz-bar0.com', 'spans': [{'text': 'mailto:foo+special@Bar.baz-bar0.com'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link alternate email no escapes', (t) => {
    const markdown = parseMarkdown('<foo\\+@bar.example.com>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '<foo+@bar.example.com>'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url "title"

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}], 'title': 'title'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition multiline', (t) => {
    const markdown = parseMarkdown(`\
   [foo]:${' '}
      /url${'  '}
           'the title'${'  '}

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}], 'title': 'the title'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition trailing non-space', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url "title" ok
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }},
                    {'text': ': /url "title" ok'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition trailing non-space 2', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url
"title" ok
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '\n"title" ok'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition code block', (t) => {
    const markdown = parseMarkdown(`\
    [foo]: /url "title"

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'codeBlock': {
                'lines': ['[foo]: /url "title"'],
                'startLineNumber': 1
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition code block 2', (t) => {
    const markdown = parseMarkdown(`\
~~~
[foo]: /url
~~~

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'codeBlock': {
                'lines': ['[foo]: /url'],
                'startLineNumber': 1
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition case-insensitive', (t) => {
    const markdown = parseMarkdown(`\
[FOO]: /url

[Foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'Foo'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition defined after', (t) => {
    const markdown = parseMarkdown(`\
[foo]

[foo]: /url "title"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}], 'title': 'title'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition container', (t) => {
    const markdown = parseMarkdown(`\
[foo]

> [foo]: /url
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}]}}
                        ]
                    }}
                ]
            }},
            {'quote': {
                'parts': []
            }}
        ]
    });
});


test('parseMarkdown, link definition multiple', (t) => {
    const markdown = parseMarkdown(`\
[foo]

[foo]: first
[foo]: second
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': 'first', 'spans': [{'text': 'foo'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition multiple 2', (t) => {
    const markdown = parseMarkdown(`\
[
foo
]: /url
bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '\nbar'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition multiple 3', (t) => {
    const markdown = parseMarkdown(`\
Foo
[bar]: /baz

[bar]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': 'Foo\n'}
                ]
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/baz', 'spans': [{'text': 'bar'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition terminate', (t) => {
    const markdown = parseMarkdown(`\
# [Foo]
[foo]: /url
> bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'Foo'}]}}
                        ]
                    }}
                ],
                'style': 'h1'
            }},
            {'quote': {
                'parts': [
                    {'paragraph': {
                        'spans': [
                            {'text': 'bar'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition terminate 2', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url
bar
===
[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'text': '\nbar'}
                ],
                'style': 'h1'
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition terminate 3', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url
===
[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [],
                'style': 'h1'
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition terminate 4', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /foo-url "foo"
[bar]: /bar-url
  "bar"
[baz]: /baz-url

[foo],
[bar],
[baz]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/foo-url', 'spans': [{'text': 'foo'}], 'title': 'foo'}}
                        ]
                    }},
                    {'text': ',\n'},
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/bar-url', 'spans': [{'text': 'bar'}], 'title': 'bar'}}
                        ]
                    }},
                    {'text': ',\n'},
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/baz-url', 'spans': [{'text': 'baz'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition text escapes', (t) => {
    const markdown = parseMarkdown(`\
[Foo*bar\\]]:my_(url) 'title (with parens)'

[Foo*bar\\]]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': 'my_(url)', 'spans': [{'text': 'Foo*bar]'}], 'title': 'title (with parens)'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition href angle', (t) => {
    const markdown = parseMarkdown(`\
[Foo bar]:
<my url>
'title'

[Foo bar]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': 'my url', 'spans': [{'text': 'Foo bar'}], 'title': 'title'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition title multiline', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url '
title
line1
line2
'

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}], 'title': '\ntitle\nline1\nline2\n'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition title no blanks', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url 'title

with blank line'

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }},
                    {'text': ": /url 'title"}
                ]
            }},
            {'paragraph': {
                'spans': [
                    {'text': "with blank line'"}
                ]
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition title none', (t) => {
    const markdown = parseMarkdown(`\
[foo]:
/url

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition href none', (t) => {
    const markdown = parseMarkdown(`\
[foo]:

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }},
                    {'text': ':'}
                ]
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition href angle none', (t) => {
    const markdown = parseMarkdown(`\
[foo]: <>

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '', 'spans': [{'text': 'foo'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition title no space', (t) => {
    const markdown = parseMarkdown(`\
[foo]: <bar>(baz)

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }},
                    {'text': ': <bar>(baz)'}
                ]
            }},
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[foo]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link definition title escapes', (t) => {
    const markdown = parseMarkdown(`\
[foo]: /url\\bar\\*baz "foo\\"bar\\baz"

[foo]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url\\bar*baz', 'spans': [{'text': 'foo'}], 'title': 'foo"bar\\baz'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference', (t) => {
    const markdown = parseMarkdown(`\
[foo][bar]

[bar]: /url "title"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url', 'spans': [{'text': 'foo'}], 'title': 'title'}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference escapes', (t) => {
    const markdown = parseMarkdown(`\
[link \\[bar][ref]

[ref]: /uri
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/uri', 'spans': [{'text': 'link [bar'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference text spans', (t) => {
    const markdown = parseMarkdown(`\
[link _foo **bar** \`#\`_][ref]

[ref]: /uri
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'text': 'link '},
                                    {'style': {
                                        'spans': [
                                            {'text': 'foo '},
                                            {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                                            {'text': ' '},
                                            {'code': '#'}
                                        ],
                                        'style': 'italic'
                                    }}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link and image reference', (t) => {
    const markdown = parseMarkdown(`\
[![moon][img]](/url "moon-link")

[img]: moon.jpg "moon-image"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {
                        'href': '/url',
                        'title': 'moon-link',
                        'spans': [
                            {'linkRef': {
                                'spans': [
                                    {'image': {'alt': 'moon', 'src': 'moon.jpg', 'title': 'moon-image'}}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link and image reference minimal', (t) => {
    const markdown = parseMarkdown(`\
[![img]](/url)

[img]: moon.jpg
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {
                        'href': '/url',
                        'spans': [
                            {'linkRef': {
                                'spans': [
                                    {'image': {'alt': 'img', 'src': 'moon.jpg'}}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link and image reference multiline', (t) => {
    const markdown = parseMarkdown(`\
[
 ![
  moon
  ][
  img
  ]
](
 /url
 "moon-link"
)

[img]: moon.jpg "moon-image"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {
                        'href': '/url',
                        'title': 'moon-link',
                        'spans': [
                            {'linkRef': {
                                'spans': [
                                    {'image': {'alt': ' moon ', 'src': 'moon.jpg', 'title': 'moon-image'}}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link and image reference missing image reference', (t) => {
    const markdown = parseMarkdown(`\
[![moon][img]](/url "moon-link")
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {
                        'href': '/url',
                        'title': 'moon-link',
                        'spans': [
                            {'linkRef': {
                                'spans': [
                                    {'text': '![moon][img]'}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image', (t) => {
    const markdown = parseMarkdown(`\
[![moon](moon.jpg "moon-image")][ref]

[ref]: /uri "moon-link"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'image': {'alt': 'moon', 'src': 'moon.jpg', 'title': 'moon-image'}}
                                ],
                                'title': 'moon-link'
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image minimal', (t) => {
    const markdown = parseMarkdown(`\
[![moon](moon.jpg)][ref]

[ref]: /uri
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'image': {'alt': 'moon', 'src': 'moon.jpg'}}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image multiline', (t) => {
    const markdown = parseMarkdown(`\
[
 ![
  moon
  ](
  moon.jpg
  "moon-image")
  ][
  ref
]

[ref]: /uri "moon-link"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'image': {'alt': ' moon ', 'src': 'moon.jpg', 'title': 'moon-image'}}
                                ],
                                'title': 'moon-link'
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image missing link reference', (t) => {
    const markdown = parseMarkdown(`\
[![moon](moon.jpg "moon-image")][ref]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[![moon](moon.jpg "moon-image")][ref]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image reference', (t) => {
    const markdown = parseMarkdown(`\
[![moon][img]][ref]

[ref]: /uri "moon-link"
[img]: moon.jpg "moon-image"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'linkRef': {
                                        'spans': [
                                            {'image': {'alt': 'moon', 'src': 'moon.jpg', 'title': 'moon-image'}}
                                        ]
                                    }}
                                ],
                                'title': 'moon-link'
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image reference minimal', (t) => {
    const markdown = parseMarkdown(`\
[![img]][ref]

[ref]: /uri
[img]: moon.jpg
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'linkRef': {
                                        'spans': [
                                            {'image': {'alt': 'img', 'src': 'moon.jpg'}}
                                        ]
                                    }}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image reference multiline', (t) => {
    const markdown = parseMarkdown(`\
[
 ![
  moon
  ][
  img
  ]
][
 ref
]

[ref]: /uri "moon-link"
[img]: moon.jpg "moon-image"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'linkRef': {
                                        'spans': [
                                            {'image': {'alt': ' moon ', 'src': 'moon.jpg', 'title': 'moon-image'}}
                                        ]
                                    }}
                                ],
                                'title': 'moon-link'
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image reference missing both references', (t) => {
    const markdown = parseMarkdown(`\
[![img]][ref]
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[![img]][ref]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image reference missing link reference', (t) => {
    const markdown = parseMarkdown(`\
[![img]][ref]

[img]: moon.jpg
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'text': '[![img]][ref]'}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference and image reference missing image reference', (t) => {
    const markdown = parseMarkdown(`\
[![img]][ref]

[ref]: /uri
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {
                                'href': '/uri',
                                'spans': [
                                    {'linkRef': {
                                        'spans': [
                                            {'text': '![img]'}
                                        ]
                                    }}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference cannot contain links', (t) => {
    const markdown = parseMarkdown(`\
[foo [bar](/uri)][ref]

[ref]: /uri
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': '/uri', 'spans': [{'text': 'foo [bar'}]}},
                    {'text': ']'},
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/uri', 'spans': [{'text': 'ref'}]}}
                        ]
                    }}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference precedence', (t) => {
    const markdown = parseMarkdown(`\
[foo]()

[foo]: /url1
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'link': {'href': '', 'spans': [{'text': 'foo'}]}}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference precedence 2', (t) => {
    const markdown = parseMarkdown(`\
[foo](not a link)

[foo]: /url1
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {'linkRef': {
                        'spans': [
                            {'link': {'href': '/url1', 'spans': [{'text': 'foo'}]}}
                        ]
                    }},
                    {'text': '(not a link)'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference consecutive', (t) => {
    const markdown = parseMarkdown(`\
[foo][bar][baz]

[baz]: /url
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {
                        'linkRef': {
                            'spans': [
                                {'linkRef': {'spans': [{'text': '[foo]'}]}},
                                {'text': '[bar]'}
                            ]
                        }
                    },
                    {
                        'linkRef': {
                            'spans': [
                                {'link': {'href': '/url', 'spans': [{'text': 'baz'}]}}
                            ]
                        }
                    }
                ]
            }}
        ]
    });
});


test('parseMarkdown, link reference empty ref', (t) => {
    const markdown = parseMarkdown(`\
[]

[]: /uri
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {
                        'linkRef': {
                            'spans': [
                                {'text': '[]'}
                            ]
                        }
                    }
                ]
            }},
            {'paragraph': {
                'spans': [
                    {
                        'linkRef': {
                            'spans': [
                                {'text': '[]'}
                            ]
                        }
                    },
                    {'text': ': /uri'}
                ]
            }}
        ]
    });
});


test('parseMarkdown, image reference', (t) => {
    const markdown = parseMarkdown(`\
![foo *bar*]

[foo *bar*]: train.jpg "train & tracks"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {
                        'linkRef': {
                            'spans': [
                                {'image': {'alt': 'foo *bar*', 'src': 'train.jpg', 'title': 'train & tracks'}}
                            ]
                        }
                    }
                ]
            }}
        ]
    });
});


test('parseMarkdown, image reference alt text', (t) => {
    const markdown = parseMarkdown(`\
![foo *bar*][foobar]

[FOOBAR]: train.jpg "train & tracks"
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {
                        'linkRef': {
                            'spans': [
                                {'image': {'alt': 'foo *bar*', 'src': 'train.jpg', 'title': 'train & tracks'}}
                            ]
                        }
                    }
                ]
            }}
        ]
    });
});


test('parseMarkdown, image reference minimal', (t) => {
    const markdown = parseMarkdown(`\
![bar]

[bar]: /url
`);
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {
        'parts': [
            {'paragraph': {
                'spans': [
                    {
                        'linkRef': {
                            'spans': [
                                {'image': {'alt': 'bar', 'src': '/url'}}
                            ]
                        }
                    }
                ]
            }}
        ]
    });
});
