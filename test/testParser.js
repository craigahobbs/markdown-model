// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/* eslint-disable id-length */

import {getMarkdownParagraphText, getMarkdownTitle, parseMarkdown} from '../lib/parser.js';
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


test('parseMarkdown', (t) => {
    const markdown = parseMarkdown(`\
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
    const markdown = parseMarkdown(`\
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
    const markdown = parseMarkdown(`\
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
                {'hr': 1},
                {'hr': 1},
                {'paragraph': {'spans': [{'text': 'More text'}]}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule hyphens', (t) => {
    const markdown = parseMarkdown(`\
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
                {'hr': 1},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule underscores', (t) => {
    const markdown = parseMarkdown(`\
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
                {'hr': 1},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule spaces', (t) => {
    const markdown = parseMarkdown(`\
Some text
 *  *    ** 
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'Some text'}]}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule beyond code block', (t) => {
    const markdown = parseMarkdown(`\
    *****
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['*****'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, horizontal rule following code block', (t) => {
    const markdown = parseMarkdown(`\
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
                {'codeBlock': {'lines': ['code'], 'startLineNumber': 3}},
                {'hr': 1}
            ]
        }
    );
});


test('parseMarkdown, heading alternate syntax', (t) => {
    const markdown = parseMarkdown(`\
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


test('parseMarkdown, heading alternate syntax multiline', (t) => {
    const markdown = parseMarkdown(`\
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
    const markdown = parseMarkdown(`\
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
                            'spans': [{'text': 'Title\nand more'}],
                            'style': 'h1'
                        }}
                    ]}
                ]
            }}
        ]}
    );
});


test('parseMarkdown, heading alternate syntax beyond code block', (t) => {
    const markdown = parseMarkdown(`\
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
    const markdown = parseMarkdown(`\
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


test('parseMarkdown, list numbered', (t) => {
    const markdown = parseMarkdown(`\
1. foo
2. bar
3) baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list mixed', (t) => {
    const markdown = parseMarkdown(`\
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


test('parseMarkdown, list paragraph-adjascent', (t) => {
    const markdown = parseMarkdown(`\
Foo
- bar
- baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list numbered paragraph-adjascent', (t) => {
    const markdown = parseMarkdown(`\
Foo
1. bar
2. baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list nested', (t) => {
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
    t.deepEqual(
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


test('parseMarkdown, list item paragraph', (t) => {
    const markdown = parseMarkdown(`\
- foo
  - bar
    - baz


      bim
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list nudge', (t) => {
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
    t.deepEqual(
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


test('parseMarkdown, list numbered nudge', (t) => {
    const markdown = parseMarkdown(`\
1. a

  2. b

   3. c
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list nudge max indent', (t) => {
    const markdown = parseMarkdown(`\
- a
 - b
  - c
   - d
    - e
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list numbered nudge max indent', (t) => {
    const markdown = parseMarkdown(`\
1. a

  2. b

    3. c
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


// Spec Issue: https://github.github.com/gfm/#example-295
// Workaround: Add a single trailing space to the empty list item line
test('parseMarkdown, list empty item', (t) => {
    const markdown = parseMarkdown(`\
* a
*

* c
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list empty item 2', (t) => {
    const markdown = parseMarkdown(`\
* a
* 

* c
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list item code block', (t) => {
    const markdown = parseMarkdown(`\
- a
- ~~~
  b


  ~~~
- c
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list item lines', (t) => {
    const markdown = parseMarkdown(`\
- a
  - b

    c
- d
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list item block quote', (t) => {
    const markdown = parseMarkdown(`\
- a
- > abc
  >
  > def
- c
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, list terminated with fenced code block', (t) => {
    const markdown = parseMarkdown(`\
- Item 1

~~~
foo
~~~
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote', (t) => {
    const markdown = parseMarkdown(`\
This is a quote:

> Four score and
> twenty years ago
> ...

Cool, huh?`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote nested', (t) => {
    const markdown = parseMarkdown(`\
> Quote text
>
> > Inner text
> >
>    > Inner text 2
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote nested complex', (t) => {
    const markdown = parseMarkdown(`\
> L1-1
>
> > > > L4-1
> > L2-1
Hello?
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote nested list', (t) => {
    const markdown = parseMarkdown(`\
>- List 1
>
  >> A sub-quote
>
   >   and more
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote is a code block', (t) => {
    const markdown = parseMarkdown(`\
    > really
    > a code block
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'lines': ['> really', '> a code block'], 'startLineNumber': 1}}
            ]
        }
    );
});


test('parseMarkdown, block quote lazy', (t) => {
    const markdown = parseMarkdown(`\
> # Foo
> bar
baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote lazy mixed', (t) => {
    const markdown = parseMarkdown(`\
> bar
baz
> foo
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote terminate with hr', (t) => {
    const markdown = parseMarkdown(`\
> foo
---
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote terminate with list', (t) => {
    const markdown = parseMarkdown(`\
> - foo
- bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote not terminated with code block', (t) => {
    const markdown = parseMarkdown(`\
>     foo
    bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote terminates code block', (t) => {
    const markdown = parseMarkdown(`\
    foo
> bar
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'codeBlock': {'startLineNumber': 1, 'lines': ['foo']}},
                {'quote': {'parts': [{'paragraph': {'spans': [{'text': 'bar'}]}}]}}
            ]
        }
    );
});


test('parseMarkdown, block quote terminates list', (t) => {
    const markdown = parseMarkdown(`\
- item 1

> quote
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, block quote empty', (t) => {
    const markdown = parseMarkdown(`\
>
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'quote': {'parts': []}}
            ]
        }
    );
});


test('parseMarkdown, code block', (t) => {
    const markdown = parseMarkdown(`\
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
                {'codeBlock': {'lines': ['code 1', 'code 2', '', 'code 3'], 'startLineNumber': 3}},
                {'paragraph': {'spans': [{'text': 'Cool, huh?'}]}}
            ]
        }
    );
});


test('parseMarkdown, code block with fenced code block text', (t) => {
    const markdown = parseMarkdown(`\
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


test('parseMarkdown, fenced code block', (t) => {
    const markdown = parseMarkdown(`\
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
                {'codeBlock': {'language': 'javascript', 'lines': ['foo();', 'bar();'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, fenced code block with fenced code block text', (t) => {
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
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'lines': ['~~~', 'foo();', 'bar();', '~~~'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, empty fenced code block', (t) => {
    const markdown = parseMarkdown(`\
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
                {'codeBlock': {'language': 'javascript', 'lines': [], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, empty, end-of-file fenced code block', (t) => {
    const markdown = parseMarkdown(`\
This is some code:

\`\`\` javascript`);
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {'spans': [{'text': 'This is some code:'}]}},
                {'codeBlock': {'language': 'javascript', 'lines': [], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, code block fenced no language', (t) => {
    const markdown = parseMarkdown(`\
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
                {'codeBlock': {'lines': ['foo();', 'bar();'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, code block nested', (t) => {
    const markdown = parseMarkdown(`\
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


test('parseMarkdown, code block indented first line', (t) => {
    const markdown = parseMarkdown(`\
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
                {'codeBlock': {'lines': ['    foo();', '    bar();'], 'startLineNumber': 3}}
            ]
        }
    );
});


test('parseMarkdown, table', (t) => {
    const markdown = parseMarkdown(`\
This is a table:

| Column A | Column B | Column C | Column D |
| -------- | -------: | :------: | :------- |
| A0       | B0       | C0       | D0       |
| A1       | B1       | C1       | D1       |

Neat!
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table crowded', (t) => {
    const markdown = parseMarkdown(`\
This is a table:
|Column A|
|--------|
|A0      |
Neat!
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table indented row', (t) => {
    const markdown = parseMarkdown(`\
| Column A |
| -------- |
| A0       |
    | A1       |
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table naked', (t) => {
    const markdown = parseMarkdown(`\
| abc | defghi |
:-: | -----------:
bar | baz
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table escapes', (t) => {
    const markdown = parseMarkdown(`\
| f\\|oo  |
| ------ |
| b \`\\|\` az |
| b **\\|** im |
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table mismatched delimiter', (t) => {
    const markdown = parseMarkdown(`\
| abc | def |
| --- |
| bar |
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table short and long', (t) => {
    const markdown = parseMarkdown(`\
| abc | def |
| --- | --- |
| bar |
| bar | baz | boo |
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table empty', (t) => {
    const markdown = parseMarkdown(`\
| abc | def |
| --- | --- |
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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


test('parseMarkdown, table list actually', (t) => {
    const markdown = parseMarkdown(`\
A | B
- | -
0 | 1
`);
    validateMarkdownModel(markdown);
    t.deepEqual(
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
                },
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'This is code '},
                            {'code': 'foo = 2 * bar'},
                            {'text': '.'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'style': 'bold', 'spans': [{'text': '*no *'}]}},
                            {'text': ' *** no*** '},
                            {'style': {'style': 'bold', 'spans': [{'text': 'no ** ** no'}]}},
                            {'text': ' '},
                            {'style': {'style': 'italic', 'spans': [{'text': 'no * * no'}]}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'foo'},
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}},
                            {'text': 'baz'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'foo'}], 'style': 'italic'}},
                            {'text': 'bar'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'foo'},
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}},
                            {'text': '.'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '*'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'a * foo bar*'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'a *foo bar *'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'a *foo bar\n*'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': `foo *${String.fromCharCode(160)}a${String.fromCharCode(160)}*`}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'foo_bar_baz'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': '_foo_bar'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'fo'},
                            {'text': 'o_bar_'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'italic'}},
                            {'text': '.'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '_'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'a _ foo bar_'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'a _foo bar _'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'a _foo bar\n_'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': `foo _${String.fromCharCode(160)}a${String.fromCharCode(160)}_`}
                        ]
                    }
                }
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


test('parseMarkdown, bold escape start', (t) => {
    const markdown = parseMarkdown('\\**foo bar**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '*'},
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'italic'}},
                        {'text': '*'}
                    ]
                }}
            ]
        }
    );
});


test('parseMarkdown, bold escape start 2', (t) => {
    const markdown = parseMarkdown('\\***foo bar**');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '*'},
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'bold'}}
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'foo'},
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                            {'text': 'baz'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'foo'}], 'style': 'bold'}},
                            {'text': 'bar'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'foo'},
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                            {'text': '.'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '*'}], 'style': 'bold'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {
                                'spans': [
                                    {'style': {'spans': [{'text': 'foo'}], 'style': 'bold'}}
                                ],
                                'style': 'bold'
                            }}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': '** foo bar**'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '*foo bar *'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '*foo bar\n*'}], 'style': 'italic'}}
                        ]
                    }
                }
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


test('parseMarkdown, underscore bold escape start', (t) => {
    const markdown = parseMarkdown('\\__foo bar__');
    validateMarkdownModel(markdown);
    t.deepEqual(
        markdown,
        {
            'parts': [
                {'paragraph': {
                    'spans': [
                        {'text': '_'},
                        {'style': {'spans': [{'text': 'foo bar'}], 'style': 'italic'}},
                        {'text': '_'}
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'foo__bar__baz'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': '__foo__bar'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': 'fo'},
                            {'text': 'o__bar__'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'bar'}], 'style': 'bold'}},
                            {'text': '.'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '_'}], 'style': 'bold'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {
                                'spans': [
                                    {'style': {'spans': [{'text': 'foo'}], 'style': 'bold'}}
                                ],
                                'style': 'bold'
                            }}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'text': '__ foo bar__'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '_foo bar _'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '_foo bar\n_'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': '*strong'}], 'style': 'bold'}},
                            {'text': ' in emph*'}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {'spans': [{'text': 'in emph *'}], 'style': 'italic'}},
                            {'text': 'strong'},
                            {'style': {'spans': [{'text': '*'}], 'style': 'italic'}}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {
                                'spans': [
                                    {'style': {'spans': [{'text': 'emph'}], 'style': 'italic'}},
                                    {'text': ' in strong'}
                                ],
                                'style': 'bold'
                            }}
                        ]
                    }
                }
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
                {
                    'paragraph': {
                        'spans': [
                            {'style': {
                                'spans': [
                                    {'text': 'in strong '},
                                    {'style': {'spans': [{'text': 'emph'}], 'style': 'italic'}}
                                ],
                                'style': 'bold'
                            }}
                        ]
                    }
                }
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


test('parseMarkdown, line breaks', (t) => {
    const markdown = parseMarkdown(`\
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
                            {'br': 1},
                            {'text': '\n  this is not\nand this is'},
                            {'br': 1}
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
