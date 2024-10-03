// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {strict as assert} from 'node:assert';
import {highlightElements} from '../lib/highlight.js';
import test from 'node:test';


test('highlightElements, null language', () => {
    assert.deepEqual(
        highlightElements(null, ['foo\nbar']),
        {
            'html': 'pre',
            'elem': {
                'html': 'code',
                'elem': {'text': 'foo\nbar\n'}
            }
        }
    );
});


test('highlightElements, unknown language', () => {
    assert.deepEqual(
        highlightElements('unknown', ['foo\nbar']),
        {
            'html': 'pre',
            'elem': {
                'html': 'code',
                'elem': {'text': 'foo\nbar\n'}
            }
        }
    );
});


test('highlightElements, barescript', () => {
    const elements = highlightElements('barescript', [
        '# Iterate over an array\n',
        `\
for number in arrayNew(1, 2, 3):
    markfownPrint('Number ' + number);
endfor
`
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
                    {'text': ' '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                        'elem': {'text': 'arrayNew'}
                    },
                    {'text': '('},
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
                    {'text': '):\n    markfownPrint('},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                        'elem': {'text': "'Number '"}
                    },
                    {'text': ' + number);\n'},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                        'elem': {'text': 'endfor'}
                    },
                    {'text': '\n'}
                ]
            }
        }
    );
});


test('highlightElements, c', () => {
    const elements = highlightElements('c', [
        `\
#include <stdio.h>

int main() {
    // Variable declarations
    int number = 42;
    char letter = 'A';
    float pi = 3.14159;

    // Function call
    printf("Hello, World! The result is %d\n", number);

    return 0;
}
`
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
            'elem': {
                'html': 'code',
                'elem': [
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                        'elem': {'text': '#include'}
                    },
                    {'text': ' <stdio.h>\n\n'},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                        'elem': {'text': 'int'}
                    },
                    {'text': ' main() {\n    '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                        'elem': {'text': '// Variable declarations'}
                    },
                    {'text': '\n    '},
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
                    {'text': ';\n    '},
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
                    {'text': ';\n    '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                        'elem': {'text': 'float'}
                    },
                    {'text': ' pi = '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                        'elem': {'text': '3.14159'}
                    },
                    {'text': ';\n\n    '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                        'elem': {'text': '// Function call'}
                    },
                    {'text': '\n    '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                        'elem': {'text': 'printf'}
                    },
                    {'text': '('},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                        'elem': {'text': '"Hello, World! The result is %d\n"'}
                    },
                    {'text': ', number);\n\n    '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                        'elem': {'text': 'return'}
                    },
                    {'text': ' '},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                        'elem': {'text': '0'}
                    },
                    {'text': ';\n}\n'}
                ]
            }
        }
    );
});


test('highlightElements, javascript', () => {
    const elements = highlightElements('javascript', [
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
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
    );
});


test('highlightElements, json', () => {
    const elements = highlightElements('json', [
        `\
{
    "a": 123,
    "b": true,
    "c": null
}
`
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
    );
});


test('highlightElements, makefile', () => {
    const elements = highlightElements('makefile', [
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

# ...

# Clean target to remove build artifacts
.PHONY: clean
clean:
	rm -f $(OBJS) $(TARGET)
`
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
                        html: 'span',
                        attr: {style: 'color: var(--markdown-model-color-highlight-string);'},
                        elem: {text: '"Debug mode enabled."'},
                    },
                    {
                        text: '\n'
                    },
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
                        'elem': {'text': '.PHONY'}
                    },
                    {'text': ': all\nall: $(TARGET)\n\n'},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                        'elem': {'text': '# ...'}
                    },
                    {'text': '\n\n'},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                        'elem': {'text': '# Clean target to remove build artifacts'}
                    },
                    {'text': '\n'},
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                        'elem': {'text': '.PHONY'}
                    },
                    {'text': ': clean\nclean:\n\trm -f $(OBJS) $(TARGET)\n'}
                ]
            }
        }
    );
});


test('highlightElements, markdown (alias)', () => {
    const elements = highlightElements('md', ['# Title\n\nSome text']);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
            'elem': {
                'html': 'code',
                'elem': [
                    {
                        'html': 'span',
                        'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                        'elem': {'text': '# Title'}
                    },
                    {'text': '\n\nSome text\n'}
                ]
            }
        }
    );
});


test('highlightElements, python', () => {
    const elements = highlightElements('python', [
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
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
    );
});


test('highlightElements, schema-markdown', () => {
    const elements = highlightElements('schema-markdown', [
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
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
    );
});


test('highlightElements, shell', () => {
    const elements = highlightElements('shell', [
        `\
# For loop to count to 5
for i in $(seq 1 $COUNT); do
    echo 'This is'
    echo "iteration $i"
done
`
    ]);
    assert.deepEqual(
        elements,
        {
            'html': 'pre',
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
    );
});
