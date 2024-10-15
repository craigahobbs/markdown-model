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
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '- '}
                        },
                        {'text': 'item 1\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '  - '}
                        },
                        {'text': 'item 2\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "~~~barescript\nmarkdownPrint('Hello')\n~~~"}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1. '}
                        },
                        {'text': 'item # 1\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '2. '}
                        },
                        {'text': 'item # 2\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '  ```\n  Stuff\n  ```'},
                        },
                        {'text': '\n\nA link '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '[Home Page](http://wherever.com#top)'}
                        },
                        {'text': '!\n\nLink with title '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
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
