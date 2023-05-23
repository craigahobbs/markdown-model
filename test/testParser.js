// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {escapeMarkdownText, getMarkdownParagraphText, getMarkdownTitle, parseMarkdown} from '../lib/parser.js';
import {strict as assert} from 'node:assert';
import test from 'node:test';
import {validateMarkdownModel} from '../lib/model.js';


test('escapeMarkdownText', () => {
    assert.equal(
        escapeMarkdownText('Escape me: \\ [ ] ( ) < > " \' * _ ~ ` # | -'),
        'Escape me: \\\\ \\[ \\] \\( \\) \\< \\> \\" \\\' \\* \\_ \\~ \\` \\# \\| \\-'
    );
});


test('getMarkdownTitle', () => {
    const markdownModel = parseMarkdown(`\
This is some text

## This is the *title*

# This is NOT the *title*

This is more text
`);
    assert.equal(getMarkdownTitle(markdownModel), 'This is the title');
});


test('getMarkdownTitle, link', () => {
    const markdownModel = parseMarkdown(`\
# This is the [title](about.html)
`);
    assert.equal(getMarkdownTitle(markdownModel), 'This is the title');
});


test('getMarkdownTitle, image', () => {
    const markdownModel = parseMarkdown(`\
# This is the ![title](title.jpg)
`);
    assert.equal(getMarkdownTitle(markdownModel), 'This is the title');
});


test('getMarkdownTitle, no title', () => {
    const markdownModel = parseMarkdown(`\
This is some text

This is more text
`);
    assert.equal(getMarkdownTitle(markdownModel), null);
});


test('getMarkdownParagraphText', () => {
    const markdownModel = parseMarkdown(`\
This is a [link](link.html)
and some more text

Some other text
`);
    const [{paragraph}] = markdownModel.parts;
    assert.equal(getMarkdownParagraphText(paragraph), 'This is a link\nand some more text');
});


test('parseMarkdown', () => {
    const markdown = parseMarkdown(`\
# Title

This is a sentence.
This is another sentence.


This is another paragraph.`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
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


test('parseMarkdown, lines', () => {
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
    assert.deepEqual(
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


test('parseMarkdown, tabs', () => {
    const markdown = parseMarkdown(`\
This is a tab "\t".

 * List 1 - 1
\t* List 2 - 1
\t* List 2 - 2
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a tab "    ".'}]}},
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'List 1 - 1'}]}},
                        {'list': {'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'List 2 - 1'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'List 2 - 2'}]}}
                            ]}
                        ]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, empty', () => {
    const markdown = parseMarkdown('');
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': []
        }
    );
});


test('parseMarkdown, horizontal rule', () => {
    const markdown = parseMarkdown(`\
Some text
***
******
More text
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': 1},
                {'hr': 1},
                {'paragraph': {'spans': [{'text': 'More text'}]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule variety', () => {
    const markdown = parseMarkdown(`\
***
---
___
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'hr': 1},
                {'hr': 1},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule not enough characters', () => {
    const markdown = parseMarkdown(`\
--
**
__
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': '--\n**\n__'}]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule initial space', () => {
    const markdown = parseMarkdown(`\
 ***
  ***
   ***
    ***
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'hr': 1},
                {'hr': 1},
                {'hr': 1},
                {'codeBlock': {
                    'lines': ['***'],
                    'startLineNumber': 4
                }}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule more than three characters', () => {
    const markdown = parseMarkdown(`\
-------------------------------------
*************************************
_____________________________________
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'hr': 1},
                {'hr': 1},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule spaces', () => {
    const markdown = parseMarkdown(`\
Some text
 -  -    --
 *  *    **
 _  _    __
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': 1},
                {'hr': 1},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule beyond code block', () => {
    const markdown = parseMarkdown(`\
    *****
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['*****'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule following code block', () => {
    const markdown = parseMarkdown(`\
This is a horizontal fule immediately following a code block:

    code

---
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a horizontal fule immediately following a code block:'}]}},
                {'codeBlock': {'lines': ['code'], 'startLineNumber': 3}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule separating lists', () => {
    const markdown = parseMarkdown(`\
- foo
***
- bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'foo'}]}}
                    ]}
                ]}},
                {'hr': 1},
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'bar'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule separating lists 2', () => {
    const markdown = parseMarkdown(`\
* foo
* * *
* bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'foo'}]}}
                    ]}
                ]}},
                {'hr': 1},
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'bar'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule within list', () => {
    const markdown = parseMarkdown(`\
- foo
- * * *
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'foo'}]}}
                    ]},
                    {'parts': [
                        {'hr': 1}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule separating paragraphs', () => {
    const markdown = parseMarkdown(`\
foo
***
bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'foo'}]}},
                {'hr': 1},
                {'paragraph': {'spans': [{'text': 'bar'}]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule header actually', () => {
    const markdown = parseMarkdown(`\
foo
---
bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'foo'}], 'style': 'h2'}},
                {'paragraph': {'spans': [{'text': 'bar'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading', () => {
    const markdown = parseMarkdown(`\
# foo
## foo
### foo
#### foo
##### foo
###### foo
####### foo
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h3', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h4', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h5', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h6', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'spans': [{'text': '####### foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading not', () => {
    const markdown = parseMarkdown(`\
#5 bolt

#hashtag
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': '#5 bolt'}]}},
                {'paragraph': {'spans': [{'text': '#hashtag'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading escape', () => {
    const markdown = parseMarkdown(`\
\\## foo
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': '## foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading spans', () => {
    const markdown = parseMarkdown(`\
# foo *bar* \\*baz\\*
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [
                    {'text': 'foo '},
                    {'style': {'style': 'italic', 'spans': [{'text': 'bar'}]}},
                    {'text': ' *baz*'}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, heading leading/trailing whitespace', () => {
    const markdown = parseMarkdown(`\
#                  foo${'                     '}
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading indent', () => {
    const markdown = parseMarkdown(`\
 ### foo
  ## foo
   # foo
    # foo
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h3', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'foo'}]}},
                {'codeBlock': {'lines': ['# foo'], 'startLineNumber': 4}}
            ]
        }
    );
});


test('parseMarkdown, heading closing characters', () => {
    const markdown = parseMarkdown(`\
## foo ##
  ###   bar    ###
### foo ###${'     '}
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h3', 'spans': [{'text': 'bar'}]}},
                {'paragraph': {'style': 'h3', 'spans': [{'text': 'foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading closing characters length', () => {
    const markdown = parseMarkdown(`\
# foo ##################################
##### foo ##
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'foo'}]}},
                {'paragraph': {'style': 'h5', 'spans': [{'text': 'foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading closing characters not', () => {
    const markdown = parseMarkdown(`\
### foo ### b
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h3', 'spans': [{'text': 'foo ### b'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading closing characters no leading space', () => {
    const markdown = parseMarkdown(`\
# foo#
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'foo#'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading closing characters escaped', () => {
    const markdown = parseMarkdown(`\
### foo \\###
## foo #\\##
# foo \\#
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h3', 'spans': [{'text': 'foo ###'}]}},
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'foo ###'}]}},
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'foo #'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading separates horizontal rules', () => {
    const markdown = parseMarkdown(`\
****
## foo
****
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'hr': 1},
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'foo'}]}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, heading separates paragraphs', () => {
    const markdown = parseMarkdown(`\
Foo bar
# baz
Bar foo
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Foo bar'}]}},
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'baz'}]}},
                {'paragraph': {'spans': [{'text': 'Bar foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading empty', () => {
    const markdown = parseMarkdown(`\
##${' '}
#
### ###
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h2', 'spans': []}},
                {'paragraph': {'spans': [{'text': '#'}]}},
                {'paragraph': {'style': 'h3', 'spans': [{'text': '###'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate', () => {
    const markdown = parseMarkdown(`\
Title *Emphasis*
================

This is a sentence.

Subtitle *Emphasis*
-------------------

Some words.
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [
                    {'text': 'Title '},
                    {'style': {'style': 'italic', 'spans': [{'text': 'Emphasis'}]}}
                ]}},
                {'paragraph': {'spans': [{'text': 'This is a sentence.'}]}},
                {'paragraph': {'style': 'h2', 'spans': [
                    {'text': 'Subtitle '},
                    {'style': {'style': 'italic', 'spans': [{'text': 'Emphasis'}]}}
                ]}},
                {'paragraph': {'spans': [{'text': 'Some words.'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate multiline', () => {
    const markdown = parseMarkdown(`\
Title
*and* More
  ===
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [
                    {'text': 'Title\n'},
                    {'style': {'style': 'italic', 'spans': [{'text': 'and'}]}},
                    {'text': ' More'}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate length', () => {
    const markdown = parseMarkdown(`\
Foo
-------------------------

Foo
=
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'Foo'}]}},
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'Foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate indented', () => {
    const markdown = parseMarkdown(`\
   Foo
---

  Foo
-----

  Foo
  ===
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h2', 'spans': [{'text': '   Foo'}]}},
                {'paragraph': {'style': 'h2', 'spans': [{'text': '  Foo'}]}},
                {'paragraph': {'style': 'h1', 'spans': [{'text': '  Foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate indented too much', () => {
    const markdown = parseMarkdown(`\
    Foo
    ---

    Foo
---
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['Foo', '---', '', 'Foo'], 'startLineNumber': 1}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, heading alternate indented too much 2', () => {
    const markdown = parseMarkdown(`\
Foo
    ---
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Foo\n    ---'}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate no internal spaces', () => {
    const markdown = parseMarkdown(`\
Foo
= =

Foo
--- -
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Foo\n= ='}]}},
                {'paragraph': {'spans': [{'text': 'Foo'}]}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, heading alternate break', () => {
    const markdown = parseMarkdown(`\
Foo${'  '}
-----
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'Foo  '}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate following block quote', () => {
    const markdown = parseMarkdown(`\
> Foo
---
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [{'paragraph': {'spans': [{'text': 'Foo'}]}}]}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, heading alternate block quote continuation', () => {
    const markdown = parseMarkdown(`\
> foo
bar
===
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [{'paragraph': {
                    'spans': [{'text': 'foo\nbar'}],
                    'style': 'h1'
                }}]}}
            ]
        }
    );
});


test('parseMarkdown, heading alternate following list', () => {
    const markdown = parseMarkdown(`\
- Foo
---
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {'parts': [
            {'list': {
                'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'Foo'}]}}
                    ]}
                ]
            }},
            {'hr': 1}
        ]}
    );
});


test('parseMarkdown, heading alternate following list multiline', () => {
    const markdown = parseMarkdown(`\
- Title
and more
=====
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {'parts': [
            {'list': {
                'items': [
                    {'parts': [
                        {'paragraph': {
                            'spans': [{'text': 'Title\nand more'}],
                            'style': 'h1'
                        }}
                    ]}
                ]
            }}
        ]}
    );
});


test('parseMarkdown, heading alternate following code block', () => {
    const markdown = parseMarkdown(`\
Title
    =====
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {'parts': [
            {'paragraph': {
                'spans': [{'text': 'Title\n    ====='}]
            }}
        ]}
    );
});


test('parseMarkdown, heading alternate no blanks', () => {
    const markdown = parseMarkdown(`\
---
Foo
---
Bar
---
Baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {'parts': [
            {'hr': 1},
            {'paragraph': {'style': 'h2', 'spans': [{'text': 'Foo'}]}},
            {'paragraph': {'style': 'h2', 'spans': [{'text': 'Bar'}]}},
            {'paragraph': {'spans': [{'text': 'Baz'}]}}
        ]}
    );
});


test('parseMarkdown, list', () => {
    const markdown = parseMarkdown(`\
- item 1

  item 1.2

* item 2
another
+ item 3`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'item 1'}]}},
                                {'paragraph': {'spans': [{'text': 'item 1.2'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'item 2\nanother'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'item 3'}]}}
                            ]}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, list numbered', () => {
    const markdown = parseMarkdown(`\
1. foo
2. bar
3) baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'foo'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'bar'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'baz'}]}}
                            ]}
                        ],
                        'start': 1
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, list mixed', () => {
    const markdown = parseMarkdown(`\
1. item 1

   item 1.2

* item 2
another
+ item 3`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'start': 1,
                        'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'item 1'}]}},
                                {'paragraph': {'spans': [{'text': 'item 1.2'}]}}
                            ]}
                        ]
                    }
                },
                {
                    'list': {
                        'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'item 2\nanother'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'item 3'}]}}
                            ]}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, list paragraph-adjascent', () => {
    const markdown = parseMarkdown(`\
Foo
- bar
- baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Foo'}]}},
                {
                    'list': {
                        'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'bar'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'baz'}]}}
                            ]}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, list numbered paragraph-adjascent', () => {
    const markdown = parseMarkdown(`\
Foo
1. bar
2. baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Foo'}]}},
                {
                    'list': {
                        'start': 1,
                        'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'bar'}]}}
                            ]},
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'baz'}]}}
                            ]}
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, list nested', () => {
    const markdown = parseMarkdown(`\
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
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': '1'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': '2'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': '3'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': '4\n    - 5'}]}},
                        {'list': {'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': '6'}]}}
                            ]}
                        ]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': '7'}]}},
                        {'list': {'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': '8'}]}},
                                {'list': {'items': [
                                    {'parts': [
                                        {'paragraph': {'spans': [{'text': '9'}]}}
                                    ]}
                                ]}}
                            ]}
                        ]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': '10'}]}}
                    ]}
                ]}},
                {'paragraph': {'spans': [{'text': 'asdf'}]}}
            ]
        }
    );
});


test('parseMarkdown, list item paragraph', () => {
    const markdown = parseMarkdown(`\
- foo
  - bar
    - baz


      bim
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {
                    'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'foo'}]}},
                            {'list': {
                                'items': [
                                    {'parts': [
                                        {'paragraph': {'spans': [{'text': 'bar'}]}},
                                        {'list': {
                                            'items': [
                                                {'parts': [
                                                    {'paragraph': {'spans': [{'text': 'baz'}]}},
                                                    {'paragraph': {'spans': [{'text': 'bim'}]}}
                                                ]}
                                            ]
                                        }}
                                    ]}
                                ]
                            }}
                        ]}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, list nudge', () => {
    const markdown = parseMarkdown(`\
- a
 - b
  - c
   - d
  - e
 - f
- g
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {
                    'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'a'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'b'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'c'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'd'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'e'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'f'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'g'}]}}
                        ]}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, list numbered nudge', () => {
    const markdown = parseMarkdown(`\
1. a

  2. b

   3. c
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {
                    'start': 1,
                    'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'a'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'b'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'c'}]}}
                        ]}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, list nudge max indent', () => {
    const markdown = parseMarkdown(`\
- a
 - b
  - c
   - d
    - e
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'a'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'b'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'c'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'd\n    - e'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, list numbered nudge max indent', () => {
    const markdown = parseMarkdown(`\
1. a

  2. b

    3. c
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {
                    'start': 1,
                    'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'a'}]}}
                        ]},
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'b'}]}}
                        ]}
                    ]
                }},
                {'codeBlock': {
                    'lines': ['3. c'],
                    'startLineNumber': 5
                }}
            ]
        }
    );
});


test('parseMarkdown, list empty item', () => {
    const markdown = parseMarkdown(`\
* a
*

* c
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'a\n*'}]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'c'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, list empty item 2', () => {
    const markdown = parseMarkdown(`\
* a
*${' '}

* c
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'a'}]}}
                    ]},
                    {'parts': []},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'c'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, list item code block', () => {
    const markdown = parseMarkdown(`\
- a
- ~~~
  b


  ~~~
- c
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'a'}]}}
                    ]},
                    {'parts': [
                        {'codeBlock': {
                            'startLineNumber': 2,
                            'lines': ['b', '', '']
                        }}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'c'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, list item lines', () => {
    const markdown = parseMarkdown(`\
- a
  - b

    c
- d
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'a'}]}},
                        {'list': {'items': [
                            {'parts': [
                                {'paragraph': {'spans': [{'text': 'b'}]}},
                                {'paragraph': {'spans': [{'text': 'c'}]}}
                            ]}
                        ]}}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'd'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, list item block quote', () => {
    const markdown = parseMarkdown(`\
- a
- > abc
  >
  > def
- c
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'a'}]}}
                    ]},
                    {'parts': [
                        {'quote': {
                            'parts': [
                                {'paragraph': {'spans': [{'text': 'abc'}]}},
                                {'paragraph': {'spans': [{'text': 'def'}]}}
                            ]
                        }}
                    ]},
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'c'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, list terminated with fenced code block', () => {
    const markdown = parseMarkdown(`\
- Item 1

~~~
foo
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'Item 1'}]}}
                    ]}
                ]}},
                {'codeBlock': {'lines': ['foo'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, block quote', () => {
    const markdown = parseMarkdown(`\
This is a quote:

> Four score and
> twenty years ago
> ...

Cool, huh?`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a quote:'}]}},
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'Four score and\ntwenty years ago\n...'}]}}
                ]}},
                {'paragraph': {'spans': [{'text': 'Cool, huh?'}]}}
            ]
        }
    );
});


test('parseMarkdown, block quote nested', () => {
    const markdown = parseMarkdown(`\
> Quote text
>
> > Inner text
> >
>    > Inner text 2
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'Quote text'}]}},
                    {'quote': {'parts': [
                        {'paragraph': {'spans': [{'text': 'Inner text'}]}},
                        {'paragraph': {'spans': [{'text': 'Inner text 2'}]}}
                    ]}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote nested complex', () => {
    const markdown = parseMarkdown(`\
> L1-1
>
> > > > L4-1
> > L2-1
Hello?
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'L1-1'}]}},
                    {'quote': {'parts': [
                        {'quote': {'parts': [
                            {'quote': {'parts': [
                                {'paragraph': {'spans': [{'text': 'L4-1\nL2-1\nHello?'}]}}
                            ]}}
                        ]}}
                    ]}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote nested list', () => {
    const markdown = parseMarkdown(`\
>- List 1
>
  >> A sub-quote
>
   >   and more
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'list': {'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'List 1'}]}}
                        ]}
                    ]}},
                    {'quote': {'parts': [
                        {'paragraph': {'spans': [{'text': 'A sub-quote'}]}}
                    ]}},
                    {'paragraph': {'spans': [{'text': 'and more'}]}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote is a code block', () => {
    const markdown = parseMarkdown(`\
    > really
    > a code block
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['> really', '> a code block'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, block quote lazy', () => {
    const markdown = parseMarkdown(`\
> # Foo
> bar
baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'Foo'}], 'style': 'h1'}},
                    {'paragraph': {'spans': [{'text': 'bar\nbaz'}]}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote lazy mixed', () => {
    const markdown = parseMarkdown(`\
> bar
baz
> foo
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'bar\nbaz\nfoo'}]}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote terminate with hr', () => {
    const markdown = parseMarkdown(`\
> foo
---
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'foo'}]}}
                ]}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, block quote terminate with list', () => {
    const markdown = parseMarkdown(`\
> - foo
- bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'list': {'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': 'foo'}]}}
                        ]}
                    ]}}
                ]}},
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'bar'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote not terminated with code block', () => {
    const markdown = parseMarkdown(`\
>     foo
    bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': [
                    {'codeBlock': {'lines': ['foo', 'bar'], 'startLineNumber': 1}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote terminates code block', () => {
    const markdown = parseMarkdown(`\
    foo
> bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'startLineNumber': 1, 'lines': ['foo']}},
                {'quote': {'parts': [{'paragraph': {'spans': [{'text': 'bar'}]}}]}}
            ]
        }
    );
});


test('parseMarkdown, block quote terminates list', () => {
    const markdown = parseMarkdown(`\
- item 1

> quote
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'item 1'}]}}
                    ]}
                ]}},
                {'quote': {'parts': [
                    {'paragraph': {'spans': [{'text': 'quote'}]}}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, block quote empty', () => {
    const markdown = parseMarkdown(`\
>
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': []}}
            ]
        }
    );
});


test('parseMarkdown, code block', () => {
    const markdown = parseMarkdown(`\
This is some code:

    code 1
    code 2

    code 3

Cool, huh?`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['code 1', 'code 2', '', 'code 3'], 'startLineNumber': 3}},
                {'paragraph': {'spans': [{'text': 'Cool, huh?'}]}}
            ]
        }
    );
});


test('parseMarkdown, code block with fenced code block text', () => {
    const markdown = parseMarkdown(`\
This is a fenced code block:

    ~~~ javascript
    code 1
    code 2

    code 3
    ~~~

Cool, huh?`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a fenced code block:'}]}},
                {'codeBlock': {
                    'lines': [
                        '~~~ javascript',
                        'code 1',
                        'code 2',
                        '',
                        'code 3',
                        '~~~'
                    ],
                    'startLineNumber': 3
                }},
                {'paragraph': {'spans': [{'text': 'Cool, huh?'}]}}
            ]
        }
    );
});


test('parseMarkdown, code block actually list item text', () => {
    const markdown = parseMarkdown(`\
  - foo

    bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {'items': [
                    {'parts': [
                        {'paragraph': {'spans': [{'text': 'foo'}]}},
                        {'paragraph': {'spans': [{'text': 'bar'}]}}
                    ]}
                ]}}
            ]
        }
    );
});


test('parseMarkdown, code block actually list item text 2', () => {
    const markdown = parseMarkdown(`\
1.  foo

    - bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'list': {
                    'start': 1,
                    'items': [
                        {'parts': [
                            {'paragraph': {'spans': [{'text': ' foo'}]}},
                            {'list': {'items': [
                                {'parts': [
                                    {'paragraph': {'spans': [{'text': 'bar'}]}}
                                ]}
                            ]}}
                        ]}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, code block blanks', () => {
    const markdown = parseMarkdown(`\
    chunk1

    chunk2
${'  '}
${' '}
${' '}
    chunk3
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {
                    'lines': [
                        'chunk1',
                        '',
                        'chunk2',
                        '  ',
                        ' ',
                        ' ',
                        'chunk3'
                    ],
                    'startLineNumber': 1
                }}
            ]
        }
    );
});


test('parseMarkdown, code block no paragraph interrupt', () => {
    const markdown = parseMarkdown(`\
Foo
    bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Foo\n    bar'}]}}
            ]
        }
    );
});


test('parseMarkdown, code block paragraph terminates', () => {
    const markdown = parseMarkdown(`\
    foo
bar
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['foo'], 'startLineNumber': 1}},
                {'paragraph': {'spans': [{'text': 'bar'}]}}
            ]
        }
    );
});


test('parseMarkdown, code block follows header', () => {
    const markdown = parseMarkdown(`\
# Heading
    foo
Heading
------
    foo
----
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'Heading'}]}},
                {'codeBlock': {'lines': ['foo'], 'startLineNumber': 2}},
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'Heading'}]}},
                {'codeBlock': {'lines': ['foo'], 'startLineNumber': 5}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, code block trailing spaces', () => {
    const markdown = parseMarkdown(`\
    foo${'  '}
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['foo  '], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block', () => {
    const markdown = parseMarkdown(`\
This is some code:

~~~
foo();
bar();
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['foo();', 'bar();'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block length', () => {
    const markdown = parseMarkdown(`\
~~~~
aaa
~~~
~~~~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['aaa', '~~~'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block not', () => {
    const markdown = parseMarkdown(`\
\`\`
foo
\`\`
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'code': 'foo'}]}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block with fenced code block text', () => {
    const markdown = parseMarkdown(`\
This is some code:

\`\`\`
~~~
foo();
bar();
~~~
\`\`\`
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['~~~', 'foo();', 'bar();', '~~~'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block empty', () => {
    const markdown = parseMarkdown(`\
This is some code:

~~~
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': [], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, empty, fenced code block end-of-file', () => {
    const markdown = parseMarkdown(`\
This is some code:

~~~`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': [], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block language', () => {
    const markdown = parseMarkdown(`\
This is some code:

~~~ javascript
foo();
bar();
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'language': 'javascript', 'lines': ['foo();', 'bar();'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block language no space', () => {
    const markdown = parseMarkdown(`\
~~~javascript
foo();
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'language': 'javascript', 'lines': ['foo();'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block nested', () => {
    const markdown = parseMarkdown(`\
- This is some code:

  ~~~
  foo();
  bar();
  ~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {
                    'list': {
                        'items': [
                            {
                                'parts': [
                                    {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                                    {'codeBlock': {'lines': ['foo();', 'bar();'], 'startLineNumber': 3}}
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    );
});


test('parseMarkdown, fenced code block indented first line', () => {
    const markdown = parseMarkdown(`\
This is some code:

~~~
    foo();
    bar();
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['    foo();', '    bar();'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block indented fence', () => {
    const markdown = parseMarkdown(`\
 ~~~
 aaa
aaa
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['aaa', 'aaa'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block indented fence 2', () => {
    const markdown = parseMarkdown(`\
  ~~~
aaa
  aaa
aaa
  ~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['aaa', 'aaa', 'aaa'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block indented fence 3', () => {
    const markdown = parseMarkdown(`\
   ~~~
   aaa
    aaa
  aaa
   ~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['aaa', ' aaa', 'aaa'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block indented fence too much', () => {
    const markdown = parseMarkdown(`\
    ~~~
    aaa
    ~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['~~~', 'aaa', '~~~'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block indented fence too much 2', () => {
    const markdown = parseMarkdown(`\
~~~
aaa
    ~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['aaa', '    ~~~', ''], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block separates paragraphs', () => {
    const markdown = parseMarkdown(`\
foo
~~~
bar
~~~
baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'foo'}]}},
                {'codeBlock': {'lines': ['bar'], 'startLineNumber': 2}},
                {'paragraph': {'spans': [{'text': 'baz'}]}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block separates headers', () => {
    const markdown = parseMarkdown(`\
foo
---
~~~
bar
~~~
# baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'style': 'h2', 'spans': [{'text': 'foo'}]}},
                {'codeBlock': {'lines': ['bar'], 'startLineNumber': 3}},
                {'paragraph': {'style': 'h1', 'spans': [{'text': 'baz'}]}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block close no language', () => {
    const markdown = parseMarkdown(`\
~~~
~~~ aaa
~~~
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['~~~ aaa'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, table', () => {
    const markdown = parseMarkdown(`\
This is a table:

| Column A | Column B | Column C | Column D |
| -------- | -------: | :------: | :------- |
| A0       | B0       | C0       | D0       |
| A1       | B1       | C1       | D1       |

Neat!
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a table:'}]}},
                {'table': {
                    'headers': [
                        [{'text': 'Column A'}],
                        [{'text': 'Column B'}],
                        [{'text': 'Column C'}],
                        [{'text': 'Column D'}]
                    ],
                    'aligns': [
                        'left',
                        'right',
                        'center',
                        'left'
                    ],
                    'rows': [
                        [
                            [{'text': 'A0'}],
                            [{'text': 'B0'}],
                            [{'text': 'C0'}],
                            [{'text': 'D0'}]
                        ],
                        [
                            [{'text': 'A1'}],
                            [{'text': 'B1'}],
                            [{'text': 'C1'}],
                            [{'text': 'D1'}]
                        ]
                    ]
                }},
                {'paragraph': {'spans': [{'text': 'Neat!'}]}}
            ]
        }
    );
});


test('parseMarkdown, table crowded', () => {
    const markdown = parseMarkdown(`\
This is a table:
|Column A|
|--------|
|A0      |
Neat!
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is a table:'}]}},
                {'table': {
                    'headers': [[{'text': 'Column A'}]],
                    'aligns': ['left'],
                    'rows': [
                        [[{'text': 'A0'}]]
                    ]
                }},
                {'paragraph': {'spans': [{'text': 'Neat!'}]}}
            ]
        }
    );
});


test('parseMarkdown, table indented row', () => {
    const markdown = parseMarkdown(`\
| Column A |
| -------- |
| A0       |
    | A1       |
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'table': {
                    'headers': [[{'text': 'Column A'}]],
                    'aligns': ['left'],
                    'rows': [
                        [[{'text': 'A0'}]]
                    ]
                }},
                {'codeBlock': {'lines': ['| A1       |'], 'startLineNumber': 4}}
            ]
        }
    );
});


test('parseMarkdown, table naked', () => {
    const markdown = parseMarkdown(`\
| abc | defghi |
:-: | -----------:
bar | baz
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'table': {
                    'headers': [[{'text': 'abc'}], [{'text': 'defghi'}]],
                    'aligns': ['center', 'right'],
                    'rows': [
                        [[{'text': 'bar'}], [{'text': 'baz'}]]
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, table escapes', () => {
    const markdown = parseMarkdown(`\
| f\\|oo  |
| ------ |
| b \`\\|\` az |
| b **\\|** im |
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'table': {
                    'headers': [[{'text': 'f|oo'}]],
                    'aligns': ['left'],
                    'rows': [
                        [[{'text': 'b '}, {'code': '|'}, {'text': ' az'}]],
                        [[{'text': 'b '}, {'style': {'style': 'bold', 'spans': [{'text': '|'}]}}, {'text': ' im'}]]
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, table mismatched delimiter', () => {
    const markdown = parseMarkdown(`\
| abc | def |
| --- |
| bar |
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [
                    {
                        'text': `\
| abc | def |
| --- |
| bar |`
                    }
                ]}}
            ]
        }
    );
});


test('parseMarkdown, table short and long', () => {
    const markdown = parseMarkdown(`\
| abc | def |
| --- | --- |
| bar |
| bar | baz | boo |
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'table': {
                    'headers': [[{'text': 'abc'}], [{'text': 'def'}]],
                    'aligns': ['left', 'left'],
                    'rows': [
                        [[{'text': 'bar'}]],
                        [[{'text': 'bar'}], [{'text': 'baz'}]]
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, table empty', () => {
    const markdown = parseMarkdown(`\
| abc | def |
| --- | --- |
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'table': {
                    'headers': [[{'text': 'abc'}], [{'text': 'def'}]],
                    'aligns': ['left', 'left']
                }}
            ]
        }
    );
});


test('parseMarkdown, table list actually', () => {
    const markdown = parseMarkdown(`\
A | B
- | -
0 | 1
`);
    validateMarkdownModel(markdown);
    assert.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'A | B'}]}},
                {'list': {
                    'items': [
                        {
                            'parts': [
                                {'paragraph': {'spans': [{'text': '| -\n0 | 1'}]}}
                            ]
                        }
                    ]
                }}
            ]
        }
    );
});
