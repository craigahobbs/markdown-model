// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {strict as assert} from 'node:assert';
import {codeBlockElements} from '../lib/highlight.js';
import test from 'node:test';


test('codeBlockElements, java', () => {
    const elements = codeBlockElements(
        {
            'language': 'java',
            'lines': [
        `\
/**
 * This is a JavaDoc comment
 */
public class HelloWorld {

    // Single-line comment
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // Print a message
        int number = 42;
        boolean isActive = true;
        char letter = 'A';
        String textBlock = """
            This is a text block.
            It spans multiple lines.
            """;
    }
}
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/**\n * This is a JavaDoc comment\n */'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'public'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'class'}
                        },
                        {'text': ' HelloWorld {\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Single-line comment'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'public'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'static'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'void'}
                        },
                        {'text': ' main('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'String'}
                        },
                        {'text': '[] args) {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'System'}
                        },
                        {'text': '.out.println('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Hello, World!"'}
                        },
                        {'text': '); '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Print a message'}
                        },
                        {'text': '\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'int'}
                        },
                        {'text': ' number = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '42'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'boolean'}
                        },
                        {'text': ' isActive = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'true'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'char'}
                        },
                        {'text': ' letter = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'A'"}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'String'}
                        },
                        {'text': ' textBlock = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {
                                'text': '"""\n            This is a text block.\n            It spans multiple lines.\n            """'
                            }
                        },
                        {'text': ';\n    }\n}\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, javascript', () => {
    const elements = codeBlockElements(
        {
            'language': 'javascript',
            'lines': [
        `\
// Iterate over an array
for (const number in [1, 2, 3]) {
    console.log(\`Number \${number}\`);
}

/*
 * Multiline comment
 */

const str = 'single' + "double";
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Iterate over an array'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'for'}
                        },
                        {'text': ' ('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'const'}
                        },
                        {'text': ' number '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'in'}
                        },
                        {'text': ' ['},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '2'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '3'}
                        },
                        {'text': ']) {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'console'}
                        },
                        {'text': '.log('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '`Number ${number}`'} // eslint-disable-line no-template-curly-in-string
                        },
                        {'text': ');\n}\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/*\n * Multiline comment\n */'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'const'}
                        },
                        {'text': ' str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'single'"}
                        },
                        {'text': ' + '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"double"'}
                        },
                        {'text': ';\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, json', () => {
    const elements = codeBlockElements(
        {
            'language': 'json',
            'lines': [
        `\
{
    "a": 123,
    "b": true,
    "c": null
}
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {'text': '{\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"a"'}
                        },
                        {'text': ': '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '123'}
                        },
                        {'text': ',\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"b"'}
                        },
                        {'text': ': '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'true'}
                        },
                        {'text': ',\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"c"'}
                        },
                        {'text': ': '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'null'}
                        },
                        {'text': '\n}\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, makefile', () => {
    const elements = codeBlockElements(
        {
            'language': 'makefile',
            'lines': [
        `\
# Variables
TARGET := myapp
SRCS := main.c utils.c

# Conditional debug flags
ifdef DEBUG
  CFLAGS += -g
  @echo "Debug mode enabled."
endif

# Use strip to remove whitespace from the source files
STRIPPED_SRCS := $(strip $(SRCS))

# Default target
.PHONY: all
all: $(TARGET)

# Clean target to remove build artifacts
.PHONY: clean
clean:
\trm -f $(OBJS) $(TARGET)

$(TARGET):
\techo "foo" > $@
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Variables'}
                        },
                        {'text': '\nTARGET := myapp\nSRCS := main.c utils.c\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Conditional debug flags'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'ifdef'}
                        },
                        {'text': ' DEBUG\n  CFLAGS += -g\n  @echo '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Debug mode enabled."'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'endif'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Use strip to remove whitespace from the source files'}
                        },
                        {'text': '\nSTRIPPED_SRCS := $('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'strip'}
                        },
                        {'text': ' $(SRCS))\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Default target'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '.PHONY:'}
                        },
                        {'text': ' all\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': 'all:'}
                        },
                        {'text': ' $(TARGET)\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Clean target to remove build artifacts'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '.PHONY:'}
                        },
                        {'text': ' clean\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': 'clean:'}
                        },
                        {'text': '\n\trm -f $(OBJS) $(TARGET)\n\n$(TARGET):\n\techo '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"foo"'}
                        },
                        {'text': ' > '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': '$@'}
                        },
                        {'text': '\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, markdown (alias)', () => {
    const elements = codeBlockElements(
        {
            'language': 'md',
            'lines': [
        `\
# Title

Some text

- item 1
  - item 2

~~~barescript
markdownPrint('Hello')
~~~

1. item # 1
2. item # 2

  \`\`\`
  Stuff
  \`\`\`

A link [Home Page](http://wherever.com#top)!

Link with title [GitHub](https://github.com "GitHub").
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '# Title'}
                        },
                        {'text': '\n\nSome text\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '- '}
                        },
                        {'text': 'item 1\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '  - '}
                        },
                        {'text': 'item 2\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "~~~barescript\nmarkdownPrint('Hello')\n~~~"}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '1. '}
                        },
                        {'text': 'item # 1\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '2. '}
                        },
                        {'text': 'item # 2\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '  ```\n  Stuff\n  ```'},
                        },
                        {'text': '\n\nA link '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '[Home Page](http://wherever.com#top)'}
                        },
                        {'text': '!\n\nLink with title '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '[GitHub](https://github.com "GitHub")'}
                        },
                        {'text': '.\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, python', () => {
    const elements = codeBlockElements(
        {
            'language': 'python',
            'lines': [
        `\
# Iterate over an array
for number in [1, 2, 3]:
    print(f'Number {number}');

double = "double";
multiSingle = '''\
Hello
'''
multiDouble = """\
Goodbye
"""
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Iterate over an array'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'for'}
                        },
                        {'text': ' number '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'in'}
                        },
                        {'text': ' ['},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '2'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '3'}
                        },
                        {'text': ']:\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '(f'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'Number {number}'"}
                        },
                        {'text': ');\n\ndouble = '},
                        {
                            'html': 'span',
                            'attr': {
                                'style': 'color: var(--markdown-model-color-highlight-string);'
                            },
                            'elem': {'text': '"double"'}
                        },
                        {'text': ';\nmultiSingle = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'''Hello\n'''"}
                        },
                        {'text': '\nmultiDouble = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"""Goodbye\n"""'}
                        },
                        {'text': '\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, rust', () => {
    const elements = codeBlockElements(
        {
            'language': 'rust',
            'lines': [
        `\
// This is a single-line comment

/*
This is a multi-line comment
*/

fn main() {
    let mut count: u32 = 0;
    let raw_str = r#"Raw string"#;
    let byte_str = b"Byte string";

    println!("Hello, world!");
    while count < 5 {
        println!("Count: {}", count);
        count += 1;
    }
}
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// This is a single-line comment'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/*\nThis is a multi-line comment\n*/'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'fn'}
                        },
                        {'text': ' main() {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'let'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'mut'}
                        },
                        {'text': ' count: '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'u32'}
                        },
                        {'text': ' = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '0'}
                        },
                        {'text': ';\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'let'}
                        },
                        {'text': ' raw_str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': 'r#"Raw string"#'}
                        },
                        {'text': ';\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'let'}
                        },
                        {'text': ' byte_str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': 'b"Byte string"'}
                        },
                        {'text': ';\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'println'}
                        },
                        {'text': '!('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Hello, world!"'}
                        },
                        {'text': ');\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'while'}
                        },
                        {'text': ' count < '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '5'}
                        },
                        {'text': ' {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'println'}
                        },
                        {'text': '!('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Count: {}"'}
                        },
                        {'text': ', count);\n        count += '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ';\n    }\n}\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, schema-markdown', () => {
    const elements = codeBlockElements(
        {
            'language': 'schema-markdown',
            'lines': [
        `\
# A number pair structure
struct NumberPair

    # The first number of the pair
    float first

    # The second number of the pair
    float second


# A number pair list type
typedef NumberPair[len > 0] NumberPairList


# Color enumeration
enum Colors
    Red
    Blue
    "Green"
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# A number pair structure'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'struct'}
                        },
                        {'text': ' NumberPair\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# The first number of the pair'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'float'}
                        },
                        {'text': ' first\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# The second number of the pair'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'float'}
                        },
                        {'text': ' second\n\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# A number pair list type'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'typedef'}
                        },
                        {'text': ' NumberPair[len > 0] NumberPairList\n\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# Color enumeration'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'enum'}
                        },
                        {'text': ' Colors\n    Red\n    Blue\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Green"'}
                        },
                        {'text': '\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, shell', () => {
    const elements = codeBlockElements(
        {
            'language': 'shell',
            'lines': [
        `\
# For loop to count to 5
for i in $(seq 1 $COUNT); do
    echo 'This is'
    echo "iteration $i"
done
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '# For loop to count to 5'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'for'}
                        },
                        {'text': ' i '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'in'}
                        },
                        {'text': ' $(seq 1 $COUNT); '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'do'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'echo'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'This is'"}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'echo'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"iteration $i"'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'done'}
                        },
                        {'text': '\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, sql', () => {
    const elements = codeBlockElements(
        {
            'language': 'sql',
            'lines': [
        `\
-- Single-line comment
SELECT 'string', TRUE, ABS(-1);

/*
 * Multi-line comment
 */
select 'string', true, abs(-1);
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '-- Single-line comment'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'SELECT'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'string'"}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'TRUE'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'ABS'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '-1'}
                        },
                        {'text': ');\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/*\n * Multi-line comment\n */'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'select'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'string'"}
                        },
                        {'text': ', true, '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'abs'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '-1'}
                        },
                        {'text': ');\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, swift', () => {
    const elements = codeBlockElements(
        {
            'language': 'swift',
            'lines': [
        `\
// Simple Swift Example

/*
This is a multi-line comment
*/

let fileIdentifier = #fileID
print("Current file identifier: \\(fileIdentifier)")

let multiLineMessage = """
This is a multi-line string.
It spans multiple lines.
"""
print(multiLineMessage)

func factorial(_ n: Int) -> Int {
    if n <= 1 {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}

let result = factorial(5)
#if swift(>=5.5)
    print("Swift version is 5.5 or newer - \\(result)")
#else
    print("Swift version is older than 5.5 - \\(result)")
#endif
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Simple Swift Example'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/*\nThis is a multi-line comment\n*/'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'let'}
                        },
                        {'text': ' fileIdentifier = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#fileID'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Current file identifier: \\(fileIdentifier)"'}
                        },
                        {'text': ')\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'let'}
                        },
                        {'text': ' multiLineMessage = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"""\nThis is a multi-line string.\nIt spans multiple lines.\n"""'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '(multiLineMessage)\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'func'}
                        },
                        {'text': ' factorial(_ n: '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'Int'}
                        },
                        {'text': ') -> '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'Int'}
                        },
                        {'text': ' {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'if'}
                        },
                        {'text': ' n <= '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ' {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'return'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': '\n    } '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'else'}
                        },
                        {'text': ' {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'return'}
                        },
                        {'text': ' n * factorial(n - '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ')\n    }\n}\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'let'}
                        },
                        {'text': ' result = factorial('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '5'}
                        },
                        {'text': ')\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#if'}
                        },
                        {'text': ' swift(>='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '5.5'}
                        },
                        {'text': ')\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Swift version is 5.5 or newer - \\(result)"'}
                        },
                        {'text': ')\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#else'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Swift version is older than 5.5 - \\(result)"'}
                        },
                        {'text': ')\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#endif'}
                        },
                        {'text': '\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, typescript', () => {
    const elements = codeBlockElements(
        {
            'language': 'typescript',
            'lines': [
        `\
// Single-line comment

/**
 * JSDoc comment describing the Example class
 */
@Decorator
class Example {
    private data: Array<number> = [1, 2, 3];

    constructor(private name: string) {}

    async fetchData(): Promise<void> {
        try {
            const response = await fetch('https://api.example.com/data');
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    greet(): void {
        const message = \`Hello, \${this.name}!\`;
        console.log(message);
    }
}
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Single-line comment'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/**\n * JSDoc comment describing the Example class\n */'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '@Decorator'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'class'}
                        },
                        {'text': ' Example {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'private'}
                        },
                        {'text': ' data: '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'Array'}
                        },
                        {'text': '<number> = ['},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '2'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '3'}
                        },
                        {'text': '];\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'constructor'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'private'}
                        },
                        {'text': ' name: string) {}\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'async'}
                        },
                        {'text': ' fetchData(): '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'Promise'}
                        },
                        {'text': '<'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'void'}
                        },
                        {'text': '> {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'try'}
                        },
                        {'text': ' {\n            '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'const'}
                        },
                        {'text': ' response = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'await'}
                        },
                        {'text': ' fetch('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'https://api.example.com/data'"}
                        },
                        {'text': ');\n            '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'console'}
                        },
                        {'text': '.log(response);\n        } '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'catch'}
                        },
                        {'text': ' (error) {\n            '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'console'}
                        },
                        {'text': '.error(error);\n        }\n    }\n\n    greet(): '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'void'}
                        },
                        {'text': ' {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'const'}
                        },
                        {'text': ' message = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            // eslint-disable-next-line no-template-curly-in-string
                            'elem': {'text': '`Hello, ${this.name}!`'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'console'}
                        },
                        {'text': '.log(message);\n    }\n}\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, xml', () => {
    const elements = codeBlockElements(
        {
            'language': 'xml',
            'lines': [
        `\
<?xml version="1.0" encoding="UTF-8"?>
<!-- This is a comment -->
<!DOCTYPE note SYSTEM "Note.dtd">
<note importance="high" category='stuff'>
    <to>Tove</to>
    <from>Jani</from>
    <heading>Reminder &amp; Notes</heading>
    <body>Don't forget me this weekend! &#169;</body>
    <?processing instruction?>
    <![CDATA[
        Some <unparsed> data & content.
    ]]>
</note>
`
            ]
        },
        null
    );
    assert.deepEqual(
        elements,
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '<?xml version="1.0" encoding="UTF-8"?>'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '<!-- This is a comment -->'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '<!DOCTYPE note SYSTEM "Note.dtd">'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<note'}
                        },
                        {'text': ' importance='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"high"'}
                        },
                        {'text': ' category='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'stuff'"}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<to'}
                        },
                        {'text': '>Tove'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</to'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<from'}
                        },
                        {'text': '>Jani'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</from'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<heading'}
                        },
                        {'text': '>Reminder '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '&amp;'}
                        },
                        {'text': ' Notes'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</heading'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<body'}
                        },
                        {'text': ">Don't forget me this weekend! "},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '&#169;'}
                        },
                        {'html': 'span','attr': {
                            'style': 'color: var(--markdown-model-color-highlight-tag);'
                        },
                         'elem': {'text': '</body'}
                        },{'text': '>\n    '
                          },
                        {'html': 'span','attr': {
                            'style': 'color: var(--markdown-model-color-highlight-preprocessor);'
                        },
                         'elem': {'text': '<?processing instruction?>'}
                        },{'text': '\n    '
                          },
                        {'html': 'span','attr': {
                            'style': 'color: var(--markdown-model-color-highlight-preprocessor);'
                        },
                         'elem': {'text': '<![CDATA[\n        Some <unparsed> data & content.\n    ]]>'}
                        },{'text': '\n'
                          },
                        {'html': 'span','attr': {
                            'style': 'color: var(--markdown-model-color-highlight-tag);'
                        },
                         'elem': {'text': '</note'}
                        },
                        {'text': '>\n'}
                    ]
                }
            }
        ]
    );
});
