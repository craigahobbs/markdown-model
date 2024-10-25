// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

import {strict as assert} from 'node:assert';
import {codeBlockElements} from '../lib/highlight.js';
import test from 'node:test';


test('codeBlockElements, lua', () => {
    const elements = codeBlockElements(
        {
            'language': 'lua',
            'lines': [
        `\
-- This is a single-line comment

--[[
    This is a multi-line comment
    spanning multiple lines.
]]

--[=[
    This is a multi-line comment
    using equals signs in the delimiters.
]=]

local function greet(name)
    print("Hello, " .. name .. "!")

    local short_str = 'This is a single-quoted string.'
    local another_str = "This is a double-quoted string."

    local long_str = [[
        This is a long string
        that spans multiple lines.
    ]]

    local complex_str = [=[
        This is a long string with ]] inside it.
    ]=]

    if name == "Lua" then
        return true
    else
        return false
    end
end

greet("World")
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
                            'elem': {'text': '-- This is a single-line comment'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '--[[\n    This is a multi-line comment\n    spanning multiple lines.\n]]'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '--[=[\n    This is a multi-line comment\n    using equals signs in the delimiters.\n]=]'}
                        },
                        {'text': '\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'local'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'function'}
                        },
                        {'text': ' greet(name)\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Hello, "'}
                        },
                        {'text': ' .. name .. '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"!"'}
                        },
                        {'text': ')\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'local'}
                        },
                        {'text': ' short_str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': "'This is a single-quoted string.'"}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'local'}
                        },
                        {'text': ' another_str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"This is a double-quoted string."'}
                        },
                        {'text': '\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'local'}
                        },
                        {'text': ' long_str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '[[\n        This is a long string\n        that spans multiple lines.\n    ]]'}
                        },
                        {'text': '\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'local'}
                        },
                        {'text': ' complex_str = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '[=[\n        This is a long string with ]] inside it.\n    ]=]'}
                        },
                        {'text': '\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'if'}
                        },
                        {'text': ' name == '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Lua"'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'then'}
                        },
                        {'text': '\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'return'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'true'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'else'}
                        },
                        {'text': '\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'return'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'false'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'end'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'end'}
                        },
                        {'text': '\n\ngreet('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"World"'}
                        },
                        {'text': ')\n'}
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


test('codeBlockElements, r', () => {
    const elements = codeBlockElements(
        {
            'language': 'r',
            'lines': [
        `\
# Calculate statistics of a numeric vector
numbers <- c(1, 2, NA, Inf)

if (length(numbers) > 0) {
    result_mean <- mean(numbers, na.rm = TRUE)
    result_sum <- sum(numbers, na.rm = TRUE)
    print(paste("The mean is", result_mean))
    print(paste("The sum is", result_sum))
} else {
    print("No numbers to calculate.")
}`
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
                            'elem': {'text': '# Calculate statistics of a numeric vector'}
                        },
                        {'text': '\nnumbers <- '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'c'}
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
                            'elem': {'text': 'NA'}
                        },
                        {'text': ', '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'Inf'}
                        },
                        {'text': ')\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'if'}
                        },
                        {'text': ' ('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'length'}
                        },
                        {'text': '(numbers) > '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '0'}
                        },
                        {'text': ') {\n    result_mean <- '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'mean'}
                        },
                        {'text': '(numbers, na.rm = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'TRUE'}
                        },
                        {'text': ')\n    result_sum <- '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'sum'}
                        },
                        {'text': '(numbers, na.rm = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': 'TRUE'}
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
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'paste'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"The mean is"'}
                        },
                        {'text': ', result_mean))\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'paste'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"The sum is"'}
                        },
                        {'text': ', result_sum))\n} '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'else'}
                        },
                        {'text': ' {\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-builtin);'},
                            'elem': {'text': 'print'}
                        },
                        {'text': '('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"No numbers to calculate."'}
                        },
                        {'text': ')\n}\n'}
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


test('codeBlockElements, systemverilog', () => {
    const elements = codeBlockElements(
        {
            'language': 'systemverilog',
            'lines': [
        `\
\`timescale 1ns/1ps

// Simple counter module with a register output
module counter #(
    parameter WIDTH = 8
) (
    input  logic          clk,    // Clock input
    input  logic          rst_n,  // Active-low reset
    input  logic [1:0]    mode,   // Operating mode
    output logic [WIDTH-1:0] count // Counter output
);
    /* Mode encoding:
     * 2'b00: Hold
     * 2'b01: Increment
     * 2'b10: Decrement
     * 2'b11: Reset
     */

    // Example literals
    localparam HOLD  = 2'b00;
    localparam MAX   = 8'hFF;
    localparam STEP  = 3.14;

    // Sequential logic
    always_ff @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            count <= '0;
        end else begin
            unique case (mode)
                2'b00:   count <= count;           // Hold
                2'b01:   count <= count + 1'b1;    // Increment
                2'b10:   count <= count - 1'b1;    // Decrement
                2'b11:   count <= '0;              // Reset
                default: count <= 'x;              // Unknown
            endcase
        end
    end

    // Example assertion
    assert property (@(posedge clk) disable iff (!rst_n)
        mode == 2'b11 |=> count == '0);

    initial $display("Counter initialized at time %0t", $time);

endmodule
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
                            'elem': {'text': '`timescale'}
                        },
                        {'text': ' 1ns/1ps\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Simple counter module with a register output'}
                        },
                        {'text': '\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'module'}
                        },
                        {'text': ' counter #(\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'parameter'}
                        },
                        {'text': ' WIDTH = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '8'}
                        },
                        {'text': '\n) (\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'input'}
                        },
                        {'text': '  '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'logic'}
                        },
                        {'text': '          clk,    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Clock input'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'input'}
                        },
                        {'text': '  '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'logic'}
                        },
                        {'text': '          rst_n,  '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Active-low reset'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'input'}
                        },
                        {'text': '  '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'logic'}
                        },
                        {'text': ' ['},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ':'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '0'}
                        },
                        {'text': ']    mode,   '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Operating mode'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'output'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'logic'}
                        },
                        {'text': ' [WIDTH-'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '1'}
                        },
                        {'text': ':'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '0'}
                        },
                        {'text': '] count '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Counter output'}
                        },
                        {'text': '\n);\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': "/* Mode encoding:\n     * 2'b00: Hold\n     * 2'b01: Increment\n" +
                                     "     * 2'b10: Decrement\n     * 2'b11: Reset\n     */"}
                        },
                        {'text': '\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Example literals'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'localparam'}
                        },
                        {'text': ' HOLD  = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "2'b00"}
                        },
                        {'text': ';\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'localparam'}
                        },
                        {'text': ' MAX   = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "8'hFF"}
                        },
                        {'text': ';\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'localparam'}
                        },
                        {'text': ' STEP  = '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': '3.14'}
                        },
                        {'text': ';\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Sequential logic'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'always_ff'}
                        },
                        {'text': ' @('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'posedge'}
                        },
                        {'text': ' clk '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'or'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'negedge'}
                        },
                        {'text': ' rst_n) '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'begin'}
                        },
                        {'text': '\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'if'}
                        },
                        {'text': ' (!rst_n) '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'begin'}
                        },
                        {'text': '\n            count <= '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "'0"}
                        },
                        {'text': ';\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'end'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'else'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'begin'}
                        },
                        {'text': '\n            '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'unique'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'case'}
                        },
                        {'text': ' (mode)\n                '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "2'b00"}
                        },
                        {'text': ':   count <= count;           '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Hold'}
                        },
                        {'text': '\n                '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "2'b01"}
                        },
                        {'text': ':   count <= count + '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "1'b1"}
                        },
                        {'text': ';    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Increment'}
                        },
                        {'text': '\n                '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "2'b10"}
                        },
                        {'text': ':   count <= count - '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "1'b1"}
                        },
                        {'text': ';    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Decrement'}
                        },
                        {'text': '\n                '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "2'b11"}
                        },
                        {'text': ':   count <= '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "'0"}
                        },
                        {'text': ';              '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Reset'}
                        },
                        {'text': '\n                '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'default'}
                        },
                        {'text': ': count <= '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "'x"}
                        },
                        {'text': ';              '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Unknown'}
                        },
                        {'text': '\n            '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'endcase'}
                        },
                        {'text': '\n        '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'end'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'end'}
                        },
                        {'text': '\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-comment);'},
                            'elem': {'text': '// Example assertion'}
                        },
                        {'text': '\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'assert'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'property'}
                        },
                        {'text': ' (@('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'posedge'}
                        },
                        {'text': ' clk) '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'disable'}
                        },
                        {'text': ' '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'iff'}
                        },
                        {'text': ' (!rst_n)\n        mode == '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "2'b11"}
                        },
                        {'text': ' |=> count == '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-literal);'},
                            'elem': {'text': "'0"}
                        },
                        {'text': ');\n\n    '},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'initial'}
                        },
                        {'text': ' $display('},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-string);'},
                            'elem': {'text': '"Counter initialized at time %0t"'}
                        },
                        {'text': ', $'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'time'}
                        },
                        {'text': ');\n\n'},
                        {
                            'html': 'span',
                            'attr': {'style': 'color: var(--markdown-model-color-highlight-keyword);'},
                            'elem': {'text': 'endmodule'}
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
