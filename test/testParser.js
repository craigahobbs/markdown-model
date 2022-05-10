// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {encodeMarkdownText, getMarkdownParagraphText, getMarkdownTitle, parseMarkdown} from '../lib/parser.js';
import test from 'ava';
import {validateMarkdownModel} from '../lib/model.js';


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


test('encodeMarkdownText', (t) => {
    t.is(encodeMarkdownText('Encode me: \\ [ ] ( ) *'), 'Encode me: \\\\ \\[ \\] \\( \\) \\*');
});


test('parseMarkdown', (t) => {
    const markdown = parseMarkdown(`
# Title

This is a sentence.
This is another sentence.


This is another paragraph.`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Title'}], 'style': 'h1'}},
                {'paragraph': {'spans': [{'text': 'This is a sentence.\nThis is another sentence.'}]}},
                {'paragraph': {'spans': [{'text': 'This is another paragraph.'}]}}
            ]
        }
    );
});


test('parseMarkdown, lines', (t) => {
    const markdown = parseMarkdown([
        '# Title',
        '',
        'This is a sentence.',
        'This is another sentence.',
        '',
        '',
        'This is another paragraph.\n\nAnd another.'
    ]);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Title'}], 'style': 'h1'}},
                {'paragraph': {'spans': [{'text': 'This is a sentence.\nThis is another sentence.'}]}},
                {'paragraph': {'spans': [{'text': 'This is another paragraph.'}]}},
                {'paragraph': {'spans': [{'text': 'And another.'}]}}
            ]
        }
    );
});


test('parseMarkdown, tabs', (t) => {
    const markdown = parseMarkdown(`
This is a tab "\t".

 * List 1 - 1
\t* List 2 - 1
\t* List 2 - 2
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a tab "    ".'}]}},
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'List 1 - 1'}]}},
                                    {
                                        'list': {
                                            'items': [
                                                {
                                                    'parts': [
                                                        {'paragraph': {'spans': [{'text': 'List 2 - 1'}]}}
                                                    ]
                                                },
                                                {
                                                    'parts': [
                                                        {'paragraph': {'spans': [{'text': 'List 2 - 2'}]}}
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, empty', (t) => {
    const markdown = parseMarkdown('');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': []
        }
    );
});


test('parseMarkdown, horizontal rule', (t) => {
    const markdown = parseMarkdown(`
Some text
***
******
More text
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': null},
                {'hr': null},
                {'paragraph': {'spans': [{'text': 'More text'}]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule hyphens', (t) => {
    const markdown = parseMarkdown(`
Some text

---
------
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': null},
                {'hr': null}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule underscores', (t) => {
    const markdown = parseMarkdown(`
Some text

___
______
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': null},
                {'hr': null}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule spaces', (t) => {
    const markdown = parseMarkdown(`
Some text
 *  *    ** 
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': null}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule beyond code block', (t) => {
    const markdown = parseMarkdown(`
    *****
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['*****']}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule following code block', (t) => {
    const markdown = parseMarkdown(`
This is a horizontal fule immediately following a code block:

    code

---
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a horizontal fule immediately following a code block:'}]}},
                {'codeBlock': {'lines': ['code']}},
                {'hr': null}
            ]
        }
    );
});


test('parseMarkdown, heading alternate syntax', (t) => {
    const markdown = parseMarkdown(`
Title
=====

This is a sentence.

Subtitle
--------

Some words.
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'Title'}]}},
                {'paragraph': {'spans': [{'text': 'This is a sentence.'}]}},
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'Subtitle'}]}},
                {'paragraph': {'spans': [{'text': 'Some words.'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate syntax multi-line', (t) => {
    const markdown = parseMarkdown(`
Title
and More
  ===
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'Title\nand More'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate syntax following list', (t) => {
    const markdown = parseMarkdown(`
- Title
and more
=====
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {'parts': [
            {'list': {
                'items': [
                    {'parts': [
                        {'paragraph': {
                            'spans': [{'text': 'Title\nand more\n====='}]
                        }}
                    ]}
                ]
            }}
        ]}
    );
});


test('parseMarkdown, heading alternate syntax beyond code block', (t) => {
    const markdown = parseMarkdown(`
Title
    =====
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {'parts': [
            {'paragraph': {
                'spans': [{'text': 'Title\n    ====='}]
            }}
        ]}
    );
});


test('parseMarkdown, list', (t) => {
    const markdown = parseMarkdown(`
- item 1

  item 1.2

* item 2
another
+ item 3`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'item 1'}]}},
                                    {'paragraph': {'spans': [{'text': 'item 1.2'}]}}
                                ]
                            },
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'item 2\nanother'}]}}
                                ]
                            },
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'item 3'}]}}
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, ordered list', (t) => {
    const markdown = parseMarkdown(`
1. item 1

   item 1.2

* item 2
another
+ item 3`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'start': 1,
                        'items': [
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'item 1'}]}},
                                    {'paragraph': {'spans': [{'text': 'item 1.2'}]}}
                                ]
                            },
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'item 2\nanother'}]}}
                                ]
                            },
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'item 3'}]}}
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, list nested', (t) => {
    const markdown = parseMarkdown(`
- 1
 - 2
  - 3
   - 4
    - 5
     - 6
  - 7
    - 8
      - 9
   - 10

asdf
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': '1'}]}}
                                ]
                            },
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': '2'}]}},
                                    {
                                        'list': {
                                            'items': [
                                                {
                                                    'parts': [
                                                        {'paragraph': {'spans': [{'text': '3'}]}}
                                                    ]
                                                },
                                                {
                                                    'parts': [
                                                        {'paragraph': {'spans': [{'text': '4'}]}},
                                                        {
                                                            'list': {
                                                                'items': [
                                                                    {
                                                                        'parts': [
                                                                            {'paragraph': {'spans': [{'text': '5'}]}}
                                                                        ]
                                                                    },
                                                                    {
                                                                        'parts': [
                                                                            {'paragraph': {'spans': [{'text': '6'}]}}
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    'parts': [
                                                        {'paragraph': {'spans': [{'text': '7'}]}},
                                                        {
                                                            'list': {
                                                                'items': [
                                                                    {
                                                                        'parts': [
                                                                            {'paragraph': {'spans': [{'text': '8'}]}},
                                                                            {
                                                                                'list': {
                                                                                    'items': [
                                                                                        {
                                                                                            'parts': [
                                                                                                {'paragraph': {'spans': [{'text': '9'}]}}
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    'parts': [
                                                        {'paragraph': {'spans': [{'text': '10'}]}}
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'asdf'}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, code block', (t) => {
    const markdown = parseMarkdown(`
This is some code:

    code 1
    code 2

    code 3

Cool, huh?`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['code 1', 'code 2', '', 'code 3']}},
                {'paragraph': {'spans': [{'text': 'Cool, huh?'}]}}
            ]
        }
    );
});


test('parseMarkdown, code block with fenced code block text', (t) => {
    const markdown = parseMarkdown(`
This is a fenced code block:

    ~~~ javascript
    code 1
    code 2

    code 3
    ~~~

Cool, huh?`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a fenced code block:'}]}},
                {'codeBlock': {'lines': [
                    '~~~ javascript',
                    'code 1',
                    'code 2',
                    '',
                    'code 3',
                    '~~~'
                ]}},
                {'paragraph': {'spans': [{'text': 'Cool, huh?'}]}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block', (t) => {
    const markdown = parseMarkdown(`
This is some code:

\`\`\` javascript
foo();
bar();
\`\`\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'language': 'javascript', 'lines': ['foo();', 'bar();']}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block with fenced code block text', (t) => {
    const markdown = parseMarkdown(`
This is some code:

\`\`\`
~~~
foo();
bar();
~~~
\`\`\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['~~~', 'foo();', 'bar();', '~~~']}}
            ]
        }
    );
});


test('parseMarkdown, empty fenced code block', (t) => {
    const markdown = parseMarkdown(`
This is some code:

\`\`\` javascript
\`\`\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'language': 'javascript', 'lines': []}}
            ]
        }
    );
});


test('parseMarkdown, empty, end-of-file fenced code block', (t) => {
    const markdown = parseMarkdown(`
This is some code:

\`\`\` javascript`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'language': 'javascript', 'lines': []}}
            ]
        }
    );
});


test('parseMarkdown, code block fenced no language', (t) => {
    const markdown = parseMarkdown(`
This is some code:

\`\`\`
foo();
bar();
\`\`\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['foo();', 'bar();']}}
            ]
        }
    );
});


test('parseMarkdown, code block nested', (t) => {
    const markdown = parseMarkdown(`
- This is some code:

  \`\`\`
  foo();
  bar();
  \`\`\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                                    {'codeBlock': {'lines': ['foo();', 'bar();']}}
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, code block indented first line', (t) => {
    const markdown = parseMarkdown(`
This is some code:

\`\`\`
    foo();
    bar();
\`\`\`
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['    foo();', '    bar();']}}
            ]
        }
    );
});


test('parseMarkdown, spans', (t) => {
    const markdown = parseMarkdown(`
These are some basic styles: **bold**, *italic*, ***bold-italic***.

This is a [link](https://foo.com) and so is [this](https://bar.com "Bar").

This is another link: <https://foo.com>

This is an ![image](https://foo.com/foo.jpg) and so is ![this](https://bar.com/bar.jpg "Bar").
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'These are some basic styles: '},
                            {'style': {'style': 'bold', 'spans': [{'text': 'bold'}]}},
                            {'text': ', '},
                            {'style': {'style': 'italic', 'spans': [{'text': 'italic'}]}},
                            {'text': ', '},
                            {'style': {'spans': [{'style': {'spans': [{'text': 'bold-italic'}], 'style': 'italic'}}], 'style': 'bold'}},
                            {'text': '.'}
                        ]
                    }
                },
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'This is a '},
                            {'link': {'href': 'https://foo.com', 'spans': [{'text': 'link'}]}},
                            {'text': ' and so is '},
                            {'link': {'href': 'https://bar.com', 'spans': [{'text': 'this'}], 'title': 'Bar'}},
                            {'text': '.'}
                        ]
                    }
                },
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'This is another link: '},
                            {'link': {'href': 'https://foo.com', 'spans': [{'text': 'https://foo.com'}]}}
                        ]
                    }
                },
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'This is an '},
                            {'image': {'alt': 'image', 'src': 'https://foo.com/foo.jpg'}},
                            {'text': ' and so is '},
                            {'image': {'alt': 'this', 'src': 'https://bar.com/bar.jpg', 'title': 'Bar'}},
                            {'text': '.'}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, nested spans', (t) => {
    const markdown = parseMarkdown(`
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
                                    {
                                        'style': {
                                            'style': 'bold',
                                            'spans': [
                                                {'text': 'with '},
                                                {'style': {'style': 'italic', 'spans': [{'text': 'formatting'}]}}
                                            ]
                                        }
                                    }
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
    const markdown = parseMarkdown(`
***no *** *** no*** **no ** ** no** *no * * no*
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {
                            'style': {
                                'style': 'bold',
                                'spans': [
                                    {
                                        'style': {
                                            'style': 'italic',
                                            'spans': [
                                                {'text': 'no '},
                                                {'style': {'style': 'bold', 'spans': [{'text': '* *'}]}},
                                                {'text': ' no'}
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {'text': ' '},
                        {
                            'style': {
                                'style': 'bold',
                                'spans': [
                                    {'text': 'no '},
                                    {'style': {'style': 'italic', 'spans': [{'text': '* *'}]}},
                                    {'text': ' no'}
                                ]
                            }
                        },
                        {'text': ' '},
                        {'style': {'style': 'italic', 'spans': [{'text': 'no * * no'}]}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link multiline', (t) => {
    const markdown = parseMarkdown('[text\ntext](href://foo.com "text\ntext")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'href://foo.com', 'spans': [{'text': 'text\ntext'}], 'title': 'text\ntext'}}
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


test('parseMarkdown, bold-italic multiline', (t) => {
    const markdown = parseMarkdown('***text\ntext***');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'style': {'spans': [{'style': {'spans': [{'text': 'text\ntext'}], 'style': 'italic'}}], 'style': 'bold'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, line breaks', (t) => {
    const markdown = parseMarkdown(`
This is a line break  
  this is not
and this is  

This is another paragraph.
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'This is a line break'},
                            {'br': null},
                            {'text': '\n  this is not\nand this is'},
                            {'br': null}
                        ]
                    }
                },
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'This is another paragraph.'}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, escapes', (t) => {
    const markdown = parseMarkdown('\\ \\* \\_ \\{ \\} \\[ \\] **bol\\.d** \\( \\) \\# \\+ \\- \\. \\! \\a');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '\\ * _ { } [ ] '},
                        {'style': {'style': 'bold', 'spans': [{'text': 'bol.d'}]}},
                        {'text': ' ( ) # + - . ! \\a'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link escapes', (t) => {
    const markdown = parseMarkdown('[tex\\]t](hre\\.f "titl\\.e")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'link': {'href': 'hre.f', 'spans': [{'text': 'tex]t'}], 'title': 'titl.e'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href space', (t) => {
    const markdown = parseMarkdown('[text](hre f)');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '[text](hre f)'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, link href alternate space', (t) => {
    const markdown = parseMarkdown('<hre f>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {'parts': [{'paragraph': {'spans': [{'text': '<hre f>'}]}}]});
});


test('parseMarkdown, link href alternate space begin', (t) => {
    const markdown = parseMarkdown('< href>');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {'parts': [{'paragraph': {'spans': [{'text': '< href>'}]}}]});
});


test('parseMarkdown, link href alternate space end', (t) => {
    const markdown = parseMarkdown('<href >');
    validateMarkdownModel(markdown);
    t.deepEqual(markdown, {'parts': [{'paragraph': {'spans': [{'text': '<href >'}]}}]});
});


test('parseMarkdown, image escapes', (t) => {
    const markdown = parseMarkdown('![al\\]t](sr\\.c "titl\\.e")');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'image': {'alt': 'al]t', 'src': 'sr.c', 'title': 'titl.e'}}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, image link', (t) => {
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
