// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {strict as assert} from 'node:assert';
import {codeBlockElements} from '../lib/highlight.js';
import test from 'node:test';


test('codeBlockElements, null language', () => {
    assert.deepEqual(
        codeBlockElements({'lines': ['foo\nbar']}, null),
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': {'text': 'foo\nbar\n'}
                }
            }
        ]
    );
});


test('codeBlockElements, unknown language', () => {
    assert.deepEqual(
        codeBlockElements({'language': 'unknown', 'lines': ['foo\nbar']}, null),
        [
            null,
            {
                'html': 'pre',
                'attr': null,
                'elem': {
                    'html': 'code',
                    'elem': {'text': 'foo\nbar\n'}
                }
            }
        ]
    );
});


test('codeBlockElements, copy unknown language', () => {
    const copyCalls = [];
    const options = {
        'copyFn': (text) => {
            copyCalls.push(text);
        }
    };
    const elements = codeBlockElements({'language': 'unknown', 'lines': ['foo', 'bar']}, options);
    const elementCallback = elements[0].elem.callback;
    assert.equal(typeof(elementCallback), 'function');
    delete elements[0].elem.callback;
    assert.deepEqual(
        elements,
        [
            {
                html: 'p',
                attr: {'style': 'cursor: pointer; font-size: 0.85em; text-align: right; user-select: none;'},
                elem: {'html': 'a', 'elem': {'text': 'Copy'}}
            },
            {
                'html': 'pre',
                'attr': {'style': 'margin-top: 0.25em'},
                'elem': {
                    'html': 'code',
                    'elem': {'text': 'foo\nbar\n'}
                }
            }
        ]
    );

    // Test the callback
    const element = {
        'addEventListener': (event, eventFn) => {
            assert.equal(event, 'click');
            eventFn();
        }
    };
    elementCallback(element);
    assert.deepEqual(copyCalls, ['foo\nbar\n']);
});


test('codeBlockElements, copy known language', () => {
    const copyCalls = [];
    const options = {
        'copyFn': (text) => {
            copyCalls.push(text);
        }
    };
    const elements = codeBlockElements({'language': 'barescript', 'lines': ["markdownPrint('Hello!')"]}, options);
    const elementCallback = elements[0].elem.callback;
    assert.equal(typeof(elementCallback), 'function');
    delete elements[0].elem.callback;
    assert.deepEqual(
        elements,
        [
            {
                html: 'p',
                attr: {'style': 'cursor: pointer; font-size: 0.85em; text-align: right; user-select: none;'},
                elem: {'html': 'a', 'elem': {'text': 'Copy'}}
            },
            {
                'html': 'pre',
                'attr': {'style': 'margin-top: 0.25em'},
                'elem': {
                    'html': 'code',
                    'elem': [
                        {
                            html: 'span',
                            attr: {style: 'color: var(--markdown-model-color-highlight-builtin);'},
                            elem: {text: 'markdownPrint'}
                        },
                        {text: '('},
                        {
                            html: 'span',
                            attr: {style: 'color: var(--markdown-model-color-highlight-string);'},
                            elem: {text: "'Hello!'"}
                        },
                        {text: ')\n'}
                    ]
                }
            }
        ]
    );

    // Test the callback
    const element = {
        'addEventListener': (event, eventFn) => {
            assert.equal(event, 'click');
            eventFn();
        }
    };
    elementCallback(element);
    assert.deepEqual(copyCalls, ["markdownPrint('Hello!')\n"]);
});


test('codeBlockElements, barescript', () => {
    const elements = codeBlockElements(
        {
            'language': 'barescript',
            'lines': [
                '# Iterate over an array\n',
                `\
number5 = 'alive'
for number in arrayNew(1, 2, 3):
    markfownPrint('Number ' + number);
endfor
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
                        {'text': '\nnumber5 = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'alive'"}
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
        ]
    );
});


test('codeBlockElements, c', () => {
    const elements = codeBlockElements(
        {
            'language': 'c',
            'lines': [
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
        ]
    );
});


test('codeBlockElements, cpp', () => {
    const elements = codeBlockElements(
        {
            'language': 'cpp',
            'lines': [
                `\
#include <vector>
#include <string>

/*
 * Main entry point
 */
int main() {
    // Iterate over each integer in the vector and print it
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    for (const auto& num : numbers) {
        std::cout << num << std::endl;
    }

    // Using a raw string literal
    std::string raw = R"(Line1
Line2
Line3)";
    std::cout << "Raw string:\n" << raw << std::endl;

    return 0;
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
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#include'}
                        },
                        {'text': ' <'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'vector'}
                        },
                        {'text': '>\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#include'}
                        },
                        {'text': ' <'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'string'}
                        },
                        {'text': '>\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/*\n * Main entry point\n */'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'int'}
                        },
                        {'text': ' main() {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Iterate over each integer in the vector and print it'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'std'}
                        },
                        {'text': '::'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'vector'}
                        },
                        {'text': '<'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'int'}
                        },
                        {'text': '> numbers = {'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '10'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '20'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '30'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '40'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '50'}
                        },
                        {'text': '};\n    '},
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
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'auto'}
                        },
                        {'text': '& num : numbers) {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'std'}
                        },
                        {'text': '::'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'cout'}
                        },
                        {'text': ' << num << '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'std'}
                        },
                        {'text': '::endl;\n    }\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Using a raw string literal'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'std'}
                        },
                        {'text': '::'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'string'}
                        },
                        {'text': ' raw = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': 'R"(Line1\nLine2\nLine3)"'}
                        },
                        {'text': ';\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'std'}
                        },
                        {'text': '::'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'cout'}
                        },
                        {'text': ' << '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Raw string:\n"'}
                        },
                        {'text': ' << raw << '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'std'}
                        },
                        {'text': '::endl;\n\n    '},
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
        ]
    );
});


test('codeBlockElements, csharp', () => {
    const elements = codeBlockElements(
        {
            'language': 'csharp',
            'lines': [
        `\
using System;

class Program
{
    static void Main()
    {
        // Single-line comment
        /* Multi-line
           comment */
        int number = 42;
        bool flag = true;
        string text = "Hello, World!";
        string multi = @"Line1
Line2
Line3";
        string interpolated = $"Number is {number}";
        object obj = null;

#if DEBUG
        Console.WriteLine("Debug mode");
#endif

        Console.WriteLine(text);
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
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'using'}
                        },
                        {'text': ' System;\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'class'}
                        },
                        {'text': ' Program\n{\n    '},
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
                        {'text': ' Main()\n    {\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Single-line comment'}
                        },
                        {'text': '\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '/* Multi-line\n           comment */'}
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
                            'elem': {'text': 'bool'}
                        },
                        {'text': ' flag = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'true'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'string'}
                        },
                        {'text': ' text = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Hello, World!"'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'string'}
                        },
                        {'text': ' multi = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '@"Line1\nLine2\nLine3"'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'string'}
                        },
                        {'text': ' interpolated = $'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Number is {number}"'}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'object'}
                        },
                        {'text': ' obj = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'null'}
                        },
                        {'text': ';\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#if'}
                        },
                        {'text': ' DEBUG\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'Console'}
                        },
                        {'text': '.WriteLine('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Debug mode"'}
                        },
                        {'text': ');\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-preprocessor);'},
                            'elem': {'text': '#endif'}
                        },
                        {'text': '\n\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'Console'}
                        },
                        {'text': '.WriteLine(text);\n    }\n}\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, go', () => {
    const elements = codeBlockElements(
        {
            'language': 'go',
            'lines': [
        `\
package main

import "fmt"

// main is the entry point of the program
func main() {
    var num int = 42
    var isValid bool = true
    str := "Hello, Go!"

    fmt.Println("String:", str)
    fmt.Println("Length of the string:", len(str))
    fmt.Println(\`This is a raw string literal.
It spans multiple lines without needing escape sequences.\`)
    fmt.Println('a')
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
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'package'}
                        },
                        {'text': ' main\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'import'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"fmt"'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// main is the entry point of the program'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'func'}
                        },
                        {'text': ' main() {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'var'}
                        },
                        {'text': ' num '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'int'}
                        },
                        {'text': ' = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '42'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'var'}
                        },
                        {'text': ' isValid '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'bool'}
                        },
                        {'text': ' = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'true'}
                        },
                        {'text': '\n    str := '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Hello, Go!"'}
                        },
                        {'text': '\n\n    fmt.Println('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"String:"'}
                        },
                        {'text': ', str)\n    fmt.Println('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Length of the string:"'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'len'}
                        },
                        {'text': '(str))\n    fmt.Println('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '`This is a raw string literal.\nIt spans multiple lines without needing escape sequences.`'}
                        },
                        {'text': ')\n    fmt.Println('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "'a'"}
                        },
                        {'text': ')\n}\n'}
                    ]
                }
            }
        ]
    );
});


test('codeBlockElements, html', () => {
    const elements = codeBlockElements(
        {
            'language': 'html',
            'lines': [
        `\
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Metadata about the document -->
    <meta charset="UTF-8">
    <meta name="description" content="A simple example to demonstrate HTML syntax highlighting.">
    <title>Syntax Highlighting Example</title>
</head>
<body>
    <!-- Main content section -->
    <h1>HTML Syntax Highlighting</h1>
    <p>This is an example of a <strong>HTML document</strong> to demonstrate syntax highlighting features.</p>
    <ul>
        <li>Item 1</li>
        <li>Item 2 &amp; More</li>
    </ul>
    <a href="https://www.example.com" target="_blank">Visit Example.com</a>
</body>
</html>
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
                            'elem': {'text': '<!DOCTYPE html>'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<html'}
                        },
                        {'text': ' lang='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"en"'}
                        },
                        {'text': '>\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<head'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '<!-- Metadata about the document -->'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<meta'}
                        },
                        {'text': ' charset='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"UTF-8"'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<meta'}
                        },
                        {'text': ' name='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"description"'}
                        },
                        {'text': ' content='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"A simple example to demonstrate HTML syntax highlighting."'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<title'}
                        },
                        {'text': '>Syntax Highlighting Example'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</title'}
                        },
                        {'text': '>\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</head'}
                        },
                        {'text': '>\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<body'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '<!-- Main content section -->'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<h1'}
                        },
                        {'text': '>HTML Syntax Highlighting'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</h1'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<p'}
                        },
                        {'text': '>This is an example of a '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<strong'}
                        },
                        {'text': '>HTML document'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</strong'}
                        },
                        {'text': '> to demonstrate syntax highlighting features.'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</p'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<ul'}
                        },
                        {'text': '>\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<li'}
                        },
                        {'text': '>Item 1'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</li'}
                        },
                        {'text': '>\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<li'}
                        },
                        {'text': '>Item 2 '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '&amp;'}
                        },
                        {'text': ' More'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</li'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</ul'}
                        },
                        {'text': '>\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '<a'}
                        },
                        {'text': ' href='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"https://www.example.com"'}
                        },
                        {'text': ' target='},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"_blank"'}
                        },
                        {'text': '>Visit Example.com'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</a'}
                        },
                        {'text': '>\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</body'}
                        },
                        {'text': '>\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-tag);'},
                            'elem': {'text': '</html'}
                        },
                        {'text': '>\n'}
                    ]
                }
            }
        ]
    );
});
