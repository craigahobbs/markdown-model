// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/** @module lib/highlight */

import {getStructMembers, validateType} from 'schema-markdown/lib/schema.js';
import {parseSchemaMarkdown} from 'schema-markdown/lib/parser.js';


/**
 * Render a code block
 *
 * @param {Object} codeBlock - The [code block model]{@link module:lib/elements~CodeBlock}
 * @param {?Object} options - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The code block's [element model]{@link https://github.com/craigahobbs/element-model#readme}
 */
export function codeBlockElements(codeBlock, options) {
    if ('language' in codeBlock) {
        const language = codeBlock.language.toLowerCase();

        // Options-provided code block render function?
        if (options !== null && 'codeBlocks' in options && language in options.codeBlocks) {
            return options.codeBlocks[language](codeBlock, options);
        }

        // Built-in code block render function?
        if (language in highlightBuiltin) {
            return highlightBuiltin[language](codeBlock, options);
        }
    }

    // No-syntax-highlighing code block render
    return highlightElements(null, codeBlock.lines, options);
}


/**
 * Compile an array of highlight models
 *
 * @param {Object[]} markdown - The array of
 *     [Highlight models]{@link https://craigahobbs.github.io/markdown-model/model/#var.vName='Highlight'}
 * @returns {Object} The map of language name/alias to [code block render function]{@link module:lib/elements~CodeBlockFn}
 */
export function compileHighlightModels(highlights) {
    const highlightMap = {};
    for (const highlight of highlights) {
        const highlightRegex = {};
        const parts = [];

        // Validate the highlight model
        validateType(highlightTypes, 'Highlight', highlight);

        // Create regex-based regex
        for (const memberName of getStructMembers(highlightTypes, highlightTypes.Highlight.struct).map((member) => member.name)) {
            if (memberName !== 'names' && memberName in highlight) {
                const part = highlight[memberName].map((str) => `(?:${str})`).join('|');
                highlightRegex[memberName] = new RegExp(`^(?:${part})`);
                parts.push(part);
            }
        }

        // Add the special aggregate-highlight-matching regexp
        highlightRegex.highlight = new RegExp(parts.map((part) => `(?:${part})`).join('|'), 'm');

        // Add the name/alias to code block render function
        const highlightFn = (codeBlock, options) => highlightElements(highlightRegex, codeBlock.lines, options);
        for (const name of highlight.names) {
            highlightMap[name] = highlightFn;
        }
    }
    return highlightMap;
}


/**
 * Generate a syntax-highlighed code block element model
 *
 * @param {?Object} highlightRegex - The compiled highlight model regex
 * @param {string[]} lines - The code block lines
 * @param {?Object} [options] - The [options object]{@link module:lib/elements~MarkdownElementsOptions}
 * @returns {*} The syntax-highlighted code [element model]{@link https://github.com/craigahobbs/element-model#readme}
 *
 * @ignore
 */
function highlightElements(highlightRegex, lines, options = null) {
    // Join the text lines
    let text = lines.map((line) => (line.endsWith('\n') ? line : `${line}\n`)).join('');

    // The copy link elements
    const copyElements = options === null || !('copyFn' in options) ? null : {
        'html': 'p', 'attr': {'style': 'cursor: pointer; font-size: 0.85em; text-align: right; user-select: none;'}, 'elem': {
            'html': 'a', 'elem': {'text': 'Copy'}, 'callback': (element) => {
                element.addEventListener('click', () => {
                    options.copyFn(`${lines.join('\n')}\n`);
                }, false);
            }
        }
    };
    const preAttr = (copyElements !== null ? {'style': 'margin-top: 0.25em'} : null);

    // No language specified or unknown language?
    if (highlightRegex === null) {
        return [
            copyElements,
            {'html': 'pre', 'attr': preAttr, 'elem': {'html': 'code', 'elem': {'text': text}}}
        ];
    }

    // Match the highlight spans
    const spans = [];
    const rHighlight = highlightRegex.highlight;
    while (true) {
        const mHighlight = rHighlight.exec(text);
        if (mHighlight === null) {
            break;
        }
        const [highlightText] = mHighlight;

        // Add the pre-text span
        if (mHighlight.index > 0) {
            spans.push({'text': text.slice(0, mHighlight.index)});
        }

        // Determine the highlight color
        let color;
        for (const memberName of getStructMembers(highlightTypes, highlightTypes.Highlight.struct).map((member) => member.name)) {
            if (memberName in highlightRegex && highlightRegex[memberName].test(highlightText)) {
                color = `var(--markdown-model-color-highlight-${memberName})`;
                break;
            }
        }

        // Add the highlight span
        spans.push({
            'html': 'span',
            'attr': {'style': `color: ${color};`},
            'elem': {'text': highlightText}
        });

        // Advance past the highlight match
        text = text.slice(mHighlight.index + highlightText.length);
    }

    // Add the final un-matched text
    if (text) {
        spans.push({'text': text});
    }

    // Create the code block elements
    return [
        copyElements,
        {'html': 'pre', 'attr': preAttr, 'elem': {'html': 'code', 'elem': spans}}
    ];
}


// The syntax-highlight model
export const highlightTypes = parseSchemaMarkdown(`\
group "Syntax Highlighting"


# Code syntax-highlighting model
struct Highlight
    # The language names/aliases. The first name is the preferred name.
    string[len > 0] names

    # Built-in regular expressions
    optional string[len > 0] builtin

    # Comment regular expressions
    optional string[len > 0] comment

    # Keyword regular expressions
    optional string[len > 0] keyword

    # Literal regular expressions
    optional string[len > 0] literal

    # Preprocessor regular expressions
    optional string[len > 0] preprocessor

    # String regular expressions
    optional string[len > 0] string

    # Tag regular expressions
    optional string[len > 0] tag
`);


// Helper to create a word list regular expression
function createWordListRegex(...words) {
    return `\\b(?:${words.map((str) => escapeRegexText(str)).join('|')})\\b`;
}


// Helper to escape regular expression text
function escapeRegexText(text) {
    return text.replace(rRegexEscape, '\\$&');
}

const rRegexEscape = /[.*+?^${}()|[\]\\]/g;


// Common regular expression source
const rCommentHash = '#.*$';
const rCommentSlashSlash = '\\/\\/.*$';
const rCommentSlashStar = '\\/\\*[\\s\\S]*?\\*\\/';
const rNumber = '(?:\\b|[-+])(?:0x[\\da-fA-F]+|\\d*\\.?\\d+(?:e[-+]?\\d+)?)';
const rStringSingle = "'(?:[^'\\\\]|\\\\.)*'";
const rStringDouble = '"(?:[^"\\\\]|\\\\.)*"';


// The map of code block language name/alias to code block render functions
const highlightBuiltin = compileHighlightModels([
    // BareScript
    {
        'names': ['barescript', 'bare-script', 'markdown-script'],
        'builtin': [
            createWordListRegex(
                'arrayCopy', 'arrayExtend', 'arrayGet', 'arrayIndexOf', 'arrayJoin', 'arrayLastIndexOf', 'arrayLength',
                'arrayNew', 'arrayNewSize', 'arrayPop', 'arrayPush', 'arraySet', 'arrayShift', 'arraySlice',
                'arraySort', 'dataAggregate', 'dataCalculatedField', 'dataFilter', 'dataJoin', 'dataLineChart',
                'dataParseCSV', 'dataSort', 'dataTable', 'dataTop', 'dataValidate', 'datetimeDay', 'datetimeHour',
                'datetimeISOFormat', 'datetimeISOParse', 'datetimeMillisecond', 'datetimeMinute', 'datetimeMonth',
                'datetimeNew', 'datetimeNow', 'datetimeSecond', 'datetimeToday', 'datetimeYear', 'documentFontSize',
                'documentInputValue', 'documentSetFocus', 'documentSetReset', 'documentSetTitle', 'documentURL',
                'drawArc', 'drawCircle', 'drawClose', 'drawEllipse', 'drawHLine', 'drawHeight', 'drawImage', 'drawLine',
                'drawMove', 'drawNew', 'drawOnClick', 'drawPathRect', 'drawRect', 'drawStyle', 'drawText',
                'drawTextHeight', 'drawTextStyle', 'drawTextWidth', 'drawVLine', 'drawWidth', 'elementModelRender',
                'jsonParse', 'jsonStringify', 'localStorageClear', 'localStorageGet', 'localStorageRemove',
                'localStorageSet', 'markdownEscape', 'markdownHeaderId', 'markdownParse', 'markdownPrint',
                'markdownTitle', 'mathAbs', 'mathAcos', 'mathAsin', 'mathAtan', 'mathAtan2', 'mathCeil', 'mathCos',
                'mathFloor', 'mathLn', 'mathLog', 'mathMax', 'mathMin', 'mathPi', 'mathRandom', 'mathRound', 'mathSign',
                'mathSin', 'mathSqrt', 'mathTan', 'numberParseFloat', 'numberParseInt', 'numberToFixed', 'objectAssign',
                'objectCopy', 'objectDelete', 'objectGet', 'objectHas', 'objectKeys', 'objectNew', 'objectSet',
                'regexEscape', 'regexMatch', 'regexMatchAll', 'regexNew', 'regexReplace', 'regexSplit',
                'schemaElements', 'schemaParse', 'schemaParseEx', 'schemaTypeModel', 'schemaValidate',
                'schemaValidateTypeModel', 'sessionStorageClear', 'sessionStorageGet', 'sessionStorageRemove',
                'sessionStorageSet', 'stringCharCodeAt', 'stringEndsWith', 'stringFromCharCode', 'stringIndexOf',
                'stringLastIndexOf', 'stringLength', 'stringLower', 'stringNew', 'stringRepeat', 'stringReplace',
                'stringSlice', 'stringSplit', 'stringStartsWith', 'stringTrim', 'stringUpper', 'systemBoolean',
                'systemCompare', 'systemFetch', 'systemGlobalGet', 'systemGlobalSet', 'systemIs', 'systemLog',
                'systemLogDebug', 'systemPartial', 'systemType', 'urlEncode', 'urlEncodeComponent', 'urlObjectCreate',
                'windowHeight', 'windowSetLocation', 'windowSetResize', 'windowSetTimeout', 'windowWidth'
            )
        ],
        'comment': [rCommentHash],
        'keyword': [
            createWordListRegex(
                'async', 'break', 'continue', 'else', 'elif', 'endfor', 'endfunction', 'endif', 'endwhile', 'for',
                'function', 'if', 'in', 'include', 'jump', 'jumpif', 'return', 'while'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'null'), rNumber],
        'string': [rStringSingle, rStringDouble]
    },

    // C
    {
        'names': ['c'],
        'builtin': [
            createWordListRegex(
                'abs', 'atof', 'atoi', 'bsearch', 'calloc', 'clock', 'div', 'exit', 'fclose', 'feof', 'fopen',
                'fprintf', 'fread', 'free', 'fscanf', 'fseek', 'ftell', 'fwrite', 'isalnum', 'isalpha', 'isdigit',
                'islower', 'isupper', 'malloc', 'memcpy', 'memmove', 'memset', 'perror', 'printf', 'qsort', 'rand',
                'realloc', 'rewind', 'scanf', 'snprintf', 'sprintf', 'srand', 'sscanf', 'strcat', 'strchr', 'strcmp',
                'strcpy', 'strlen', 'strncat', 'strncmp', 'strncpy', 'strstr', 'strtod', 'strtof', 'strtol', 'strtoll',
                'strtoul', 'strtoull', 'system', 'time', 'tolower', 'toupper', 'vsnprintf'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'auto', 'bool', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
                'extern', 'float', 'for', 'goto', 'if', 'inline', 'int', 'long', 'register', 'restrict', 'return',
                'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void',
                'volatile', 'while', '_Alignas', '_Alignof', '_Atomic', '_Bool', '_Complex', '_Generic', '_Imaginary',
                '_Noreturn', '_Static_assert', '_Thread_local'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'NULL'), rNumber],
        'preprocessor': [
            '^[ \\t]*#(?:define|include|ifdef|ifndef|endif|if|else|elif|undef|pragma|error|warning|line)\\b'
        ],
        'string': [rStringSingle, rStringDouble]
    },

    // C++
    {
        'names': ['c++', 'cpp'],
        'builtin': [
            createWordListRegex(
                'accumulate', 'advance', 'algorithm', 'all_of', 'any_of', 'array', 'async', 'begin', 'bind', 'bitset',
                'cbegin', 'cend', 'cerr', 'chrono', 'cin', 'clog', 'cmath', 'condition_variable', 'copy', 'cout',
                'cref', 'cstdio', 'cstdlib', 'cstring', 'deque', 'distance', 'duration', 'end', 'equal_range',
                'exception', 'fill', 'find', 'find_if', 'forward', 'function', 'future', 'get', 'initializer_list',
                'invalid_argument', 'iostream', 'list', 'lock_guard', 'logic_error', 'lower_bound', 'make_pair',
                'make_tuple', 'map', 'max', 'max_element', 'mem_fn', 'min', 'min_element', 'move', 'mutex', 'next',
                'none_of', 'out_of_range', 'packaged_task', 'pair', 'prev', 'priority_queue', 'promise', 'queue',
                'ratio', 'recursive_mutex', 'ref', 'remove', 'remove_if', 'reverse', 'runtime_error', 'set',
                'shared_ptr', 'sort', 'stack', 'std', 'stod', 'stof', 'stoi', 'stol', 'stold', 'stoll', 'stoul',
                'stoull', 'string', 'swap', 'system_error', 'this_thread', 'thread', 'tie', 'time_point', 'to_string',
                'transform', 'tuple', 'unique', 'unique_lock', 'unique_ptr', 'unordered_map', 'unordered_set',
                'upper_bound', 'vector', 'wcerr', 'wcin', 'wclog', 'wcout', 'weak_ptr'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case',
                'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const', 'consteval',
                'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype',
                'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern',
                'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new',
                'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public',
                'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof', 'static',
                'static_assert', 'static_cast', 'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local',
                'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual',
                'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'NULL'), rNumber],
        'preprocessor': [
            '^[ \\t]*#(?:define|include|ifdef|ifndef|endif|if|else|elif|undef|pragma|error|warning|line)\\b'
        ],
        'string': [rStringSingle, rStringDouble, 'R"(?<cppRaw>[^\\s]*)\\((?:[\\s\\S]*?)\\)\\k<cppRaw>"']
    },

    // C#
    {
        'names': ['c#', 'csharp', 'cake', 'cakescript'],
        'builtin': [
            createWordListRegex(
                'Array', 'BitConverter', 'Boolean', 'Byte', 'Char', 'Console', 'DateTime', 'DateTimeOffset', 'Decimal',
                'Delegate', 'Double', 'Enum', 'Exception', 'GC', 'Guid', 'Int16', 'Int32', 'Int64', 'Math', 'Object', 'Random',
                'SByte', 'Single', 'String', 'StringBuilder', 'TimeSpan', 'UInt16', 'UInt32', 'UInt64', 'Void'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'abstract', 'add', 'alias', 'as', 'ascending', 'async', 'await', 'base', 'bool', 'break', 'byte', 'by',
                'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate',
                'descending', 'do', 'double', 'dynamic', 'else', 'enum', 'equals', 'event', 'explicit', 'extern',
                'finally', 'fixed', 'float', 'for', 'foreach', 'from', 'get', 'global', 'goto', 'group', 'if',
                'implicit', 'in', 'int', 'interface', 'internal', 'into', 'is', 'join', 'let', 'lock', 'long',
                'namespace', 'nameof', 'new', 'object', 'on', 'operator', 'orderby', 'out', 'override', 'params',
                'partial', 'private', 'protected', 'public', 'readonly', 'ref', 'remove', 'return', 'sbyte', 'sealed',
                'select', 'set', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this',
                'throw', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'value', 'var',
                'virtual', 'void', 'volatile', 'when', 'where', 'while', 'yield'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'null'), rNumber],
        'preprocessor': [
            '^[ \\t]*#(?:define|elif|else|endif|error|if|line|pragma|region|endregion|undef|warning)\\b'
        ],
        'string': ['@"(?:[^"]|"")*"', rStringSingle, rStringDouble]
    },

    // CSS
    {
        'names': ['css'],
        'comment': [rCommentSlashStar],
        'keyword': [
            `\\b(?:${[
                'align-content', 'align-items', 'align-self', 'animation', 'animation-delay', 'animation-direction',
                'animation-duration', 'animation-fill-mode', 'animation-iteration-count', 'animation-name',
                'animation-play-state', 'animation-timing-function', 'background', 'background-attachment',
                'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin',
                'background-position', 'background-repeat', 'background-size', 'border', 'border-bottom',
                'border-bottom-color', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-bottom-style',
                'border-bottom-width', 'border-collapse', 'border-color', 'border-image', 'border-image-outset',
                'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left',
                'border-left-color', 'border-left-style', 'border-left-width', 'border-radius', 'border-right',
                'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style',
                'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius',
                'border-top-style', 'border-top-width', 'border-width', 'bottom', 'box-shadow', 'box-sizing',
                'caption-side', 'clear', 'clip', 'color', 'column-count', 'column-fill', 'column-gap', 'column-rule',
                'column-rule-color', 'column-rule-style', 'column-rule-width', 'column-span', 'column-width', 'columns',
                'content', 'counter-increment', 'counter-reset', 'cursor', 'direction', 'display', 'empty-cells',
                'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float',
                'font', 'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'height',
                'justify-content', 'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image',
                'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right',
                'margin-top', 'max-height', 'max-width', 'min-height', 'min-width', 'opacity', 'order', 'outline',
                'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-x',
                'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
                'page-break-after', 'page-break-before', 'page-break-inside', 'perspective', 'perspective-origin',
                'position', 'quotes', 'resize', 'right', 'table-layout', 'text-align', 'text-decoration',
                'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-indent',
                'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform', 'transform-origin',
                'transform-style', 'transition', 'transition-delay', 'transition-duration', 'transition-property',
                'transition-timing-function', 'vertical-align', 'visibility', 'white-space', 'width', 'word-break',
                'word-spacing', 'word-wrap', 'z-index'
            ].map((text) => escapeRegexText(text)).join('|')}):`
        ],
        'literal': [
            '#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\\b',
            '(?:\\b|[-+])(?:\\d*\\.\\d+|\\d+)(?:[eE][-+]?\\d+)?(?:(?:px|em|rem|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ex|ch)\\b|%)?'
        ],
        'preprocessor': ['@\\w+'],
        'string': [rStringSingle, rStringDouble]
    },

    // Go
    {
        'names': ['go', 'golang'],
        'builtin': [
            createWordListRegex(
                'append', 'cap', 'close', 'complex', 'copy', 'delete', 'imag', 'len', 'make', 'new', 'panic', 'print',
                'println', 'real', 'recover'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'bool', 'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else', 'fallthrough', 'for',
                'func', 'go', 'goto', 'if', 'import', 'interface', 'int', 'int8', 'int16', 'int32', 'int64', 'map',
                'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'uint', 'uint8', 'uint16', 'uint32',
                'uint64', 'uintptr', 'var'
            )
        ],
        'literal': [createWordListRegex('false', 'iota', 'nil', 'true'), rNumber, rStringSingle],
        'string': [rStringDouble, '`[^`]*`']
    },

    // HTML
    {
        'names': ['html', 'xhtml'],
        'comment': ['<!--[\\s\\S]*?-->'],
        'literal': ['&#[0-9]+;', '&(?:amp|apos|copy|eacute|hellip|gt|lt|mdash|nbsp|quot|reg|rsquo|sect|semi|szlig|uuml);'],
        'preprocessor': [
            '<!DOCTYPE[^>]*>',
            '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'
        ],
        'string': [rStringSingle, rStringDouble],
        'tag': ['<\\/?\\s*(?:[A-Za-z_][A-Za-z0-9_.:-]*)']
    },

    // Java
    {
        'names': ['java'],
        'builtin': [
            createWordListRegex(
                'Appendable', 'AutoCloseable', 'Boolean', 'Byte', 'CharSequence', 'Character', 'Class', 'ClassLoader',
                'ClassValue', 'Cloneable', 'Comparable', 'Compiler', 'Double', 'Enum', 'Float',
                'InheritableThreadLocal', 'Integer', 'Iterable', 'Long', 'Math', 'Number', 'Object', 'Package',
                'Process', 'ProcessBuilder', 'Readable', 'Runnable', 'Runtime', 'RuntimePermission', 'SecurityManager',
                'Short', 'StackTraceElement', 'StrictMath', 'String', 'StringBuffer', 'StringBuilder', 'System',
                'Thread', 'ThreadGroup', 'ThreadLocal', 'Throwable', 'Void'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue',
                'default', 'do', 'double', 'else', 'enum', 'exports', 'extends', 'final', 'finally', 'float', 'for',
                'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'module', 'native',
                'new', 'open', 'opens', 'package', 'private', 'protected', 'public', 'requires', 'return', 'short',
                'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
                'transitive', 'try', 'uses', 'var', 'void', 'volatile', 'while'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'null'), rNumber],
        'preprocessor': ['@\\w+'],
        'string': ['"""[\\s\\S]*?"""', rStringSingle, rStringDouble]
    },

    // JavaScript (ES6)
    {
        'names': ['javascript', 'js', 'node'],
        'builtin': [
            createWordListRegex(
                'Array', 'ArrayBuffer', 'Boolean', 'console', 'DataView', 'Date', 'decodeURI', 'decodeURIComponent',
                'encodeURI', 'encodeURIComponent', 'Error', 'EvalError', 'Float32Array', 'Float64Array', 'Function',
                'Infinity', 'Int8Array', 'Int16Array', 'Int32Array', 'isFinite', 'isNaN', 'JSON', 'Map', 'Math', 'NaN',
                'Number', 'Object', 'parseFloat', 'parseInt', 'Promise', 'Proxy', 'RangeError', 'ReferenceError',
                'Reflect', 'RegExp', 'Set', 'String', 'Symbol', 'SyntaxError', 'TypeError', 'Uint8Array',
                'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'URIError', 'WeakMap', 'WeakSet'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
                'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new',
                'return', 'super', 'switch', 'static', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with',
                'yield'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'null', 'undefined'), rNumber],
        'string': [rStringSingle, rStringDouble, '`(?:[^`\\\\]|\\\\[\\s\\S])*`']
    },

    // JSON
    {
        'names': ['json'],
        'literal': [createWordListRegex('true', 'false', 'null'), rNumber],
        'string': [rStringDouble]
    },

    // Lua
    {
        'names': ['lua'],
        'builtin': [
            createWordListRegex(
                'assert', 'collectgarbage', 'coroutine', 'coroutine.create', 'coroutine.resume', 'coroutine.running',
                'coroutine.status', 'coroutine.wrap', 'coroutine.yield', 'debug', 'debug.debug', 'debug.gethook',
                'debug.getinfo', 'debug.getlocal', 'debug.getmetatable', 'debug.getregistry', 'debug.getupvalue',
                'debug.sethook', 'debug.setlocal', 'debug.setmetatable', 'debug.setupvalue', 'debug.traceback',
                'dofile', 'error', 'getmetatable', 'io', 'ipairs', 'load', 'loadfile', 'math', 'math.abs', 'math.acos',
                'math.asin', 'math.atan', 'math.ceil', 'math.cos', 'math.deg', 'math.exp', 'math.floor', 'math.fmod',
                'math.huge', 'math.log', 'math.max', 'math.maxinteger', 'math.min', 'math.mininteger', 'math.modf',
                'math.pi', 'math.rad', 'math.random', 'math.randomseed', 'math.sin', 'math.sqrt', 'math.tan',
                'math.tointeger', 'math.type', 'math.ult', 'next', 'os', 'os.clock', 'os.date', 'os.difftime',
                'os.execute', 'os.exit', 'os.getenv', 'os.remove', 'os.rename', 'os.setlocale', 'os.time', 'os.tmpname',
                'package', 'package.loadlib', 'package.searchpath', 'pairs', 'pcall', 'print', 'rawequal', 'rawget',
                'rawlen', 'rawset', 'select', 'setmetatable', 'string', 'string.byte', 'string.char', 'string.dump',
                'string.find', 'string.format', 'string.gmatch', 'string.gsub', 'string.len', 'string.lower',
                'string.match', 'string.pack', 'string.packsize', 'string.rep', 'string.reverse', 'string.sub',
                'string.unpack', 'string.upper', 'table', 'table.concat', 'table.insert', 'table.move', 'table.pack',
                'table.remove', 'table.sort', 'table.unpack', 'tonumber', 'tostring', 'type', 'utf8', 'utf8.char',
                'utf8.charpattern', 'utf8.codepoint', 'utf8.codes', 'utf8.len', 'utf8.offset', 'xpcall'
            )
        ],
        'comment': ['--\\[(?<luaComment>=*)\\[[\\s\\S]*?\\]\\k<luaComment>\\]', '--.*$'],
        'keyword': [
            createWordListRegex(
                'and', 'break', 'do', 'else', 'elseif', 'end', 'for', 'function', 'goto', 'if', 'in', 'local', 'not',
                'or', 'repeat', 'return', 'then', 'until', 'while'
            )
        ],
        'literal': [createWordListRegex('false', 'nil', 'true'), rNumber],
        'string': [rStringSingle, rStringDouble, '\\[(?<luaString>=*)\\[[\\s\\S]*?\\]\\k<luaString>\\]']
    },

    // Makefile
    {
        'names': ['makefile', 'make', 'mf', 'bsdmake'],
        'builtin': [
            createWordListRegex(
                'abspath', 'addprefix', 'addsuffix', 'and', 'basename', 'call', 'dir', 'error', 'eval', 'file',
                'filter', 'filter-out', 'findstring', 'firstword', 'foreach', 'guile', 'if', 'info', 'join', 'lastword',
                'notdir', 'or', 'origin', 'patsubst', 'realpath', 'shell', 'sort', 'strip', 'subst', 'suffix', 'value',
                'warning', 'wildcard', 'word', 'wordlist', 'words',
            ),

            // Automatic variables
            '\\$[@<^+?*%|]',
            '\\$\\([@<^+?*%][DF]\\)'
        ],
        'comment': [rCommentHash],
        'keyword': [
            createWordListRegex(
                'define', 'else', 'endef', 'endif', 'export', 'ifdef', 'ifeq', 'ifndef', 'ifneq', 'include', 'override',
                'unexport', 'vpath'
            )
        ],
        'preprocessor': [
            `^ *\\.(?:${[
                'PHONY', 'SUFFIXES', 'DEFAULT', 'PRECIOUS', 'INTERMEDIATE', 'SECONDARY', 'SECONDEXPANSION',
                'DELETE_ON_ERROR', 'LOW_RESOLUTION_TIME', 'SILENT', 'EXPORT_ALL_VARIABLES', 'IGNORE', 'POSIX', 'MAKE',
                'NOTPARALLEL', 'ONESHELL', 'RECIPEPREFIX',

                // Makefile special target names are case-insensitive so include lowercase versions
                'phony', 'suffixes', 'default', 'precious', 'intermediate', 'secondary', 'secondexpansion',
                'delete_on_error', 'low_resolution_time', 'silent', 'export_all_variables', 'ignore', 'posix', 'make',
                'notparallel', 'oneshell', 'recipeprefix'
            ].join('|')}) *:`
        ],
        'string': [rStringSingle, rStringDouble],
        'tag': ['^ *[A-Za-z0-9_\\-][A-Za-z0-9_\\-/.]* *:(?!=)']
    },

    // Markdown
    {
        'names': ['markdown', 'md'],
        'literal': [
            // Fenced code blocks
            '^(?<mdFence> *(?:`{3,}|~{3,}))[\\s\\S]+?\\n\\k<mdFence> *$'
        ],
        'string': [
            // List bullets
            '^[ \\t]*[-+*]\\s',
            '^[ \\t]*\\d+\\.\\s',

            // Links
            '\\[(?:[^\\]]+)\\]\\((?:[^)\\s]+)(?:\\s+"[^"]+")?\\)'
        ],
        'tag': [
            // Titles
            '^ *#.*$'
        ]
    },

    // PHP
    {
        'names': ['php'],
        'builtin': [
            createWordListRegex(
                'array_filter', 'array_key_exists', 'array_keys', 'array_map', 'array_merge', 'array_pop', 'array_push',
                'array_shift', 'array_slice', 'array_unshift', 'array_values', 'count', 'date', 'define', 'explode',
                'fclose', 'file_exists', 'file_get_contents', 'file_put_contents', 'fopen', 'header', 'htmlentities',
                'htmlspecialchars', 'implode', 'in_array', 'is_array', 'is_null', 'is_numeric', 'is_string',
                'json_decode', 'json_encode', 'mysqli_query', 'preg_match', 'preg_replace', 'print_r', 'session_start',
                'sort', 'sprintf', 'str_replace', 'strlen', 'strpos', 'strtolower', 'substr', 'time', 'trim', 'var_dump'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar, rCommentHash],
        'keyword': [
            createWordListRegex(
                '__halt_compiler', 'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class',
                'clone', 'const', 'continue', 'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty',
                'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends',
                'final', 'finally', 'fn', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements', 'include',
                'include_once', 'instanceof', 'insteadof', 'interface', 'isset', 'list', 'match', 'namespace', 'new',
                'or', 'print', 'private', 'protected', 'public', 'require', 'require_once', 'return', 'static',
                'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor', 'yield', 'yield from'
            )
        ],
        'literal': [createWordListRegex('false', 'null', 'true'), rNumber],
        'preprocessor': ['^[ \\t]*#(?:include|require)\\b'],
        'string': [
            rStringSingle,
            rStringDouble,
            '<<<(?<phpString>[A-Za-z_][A-Za-z0-9_]*)[\\s\\S]+?\\k<phpString>(;?|\\b)',
            '`(?:[^`\\\\]|\\\\.)*`'
        ]
    },

    // PowerShell
    {
        'names': ['powershell', 'posh', 'pwsh'],
        'builtin': [
            createWordListRegex(
                'ForEach-Object', 'Get-Content', 'Get-Command', 'Get-Help', 'Import-Module', 'Out-Host', 'Out-Null',
                'Select-Object', 'Where-Object', 'Write-Error', 'Write-Host', 'Write-Output', 'Write-Warning'
            )
        ],
        'comment': ['#(?![a-z]).*$', '<#[\\s\\S]*?#>'],
        'keyword': [
            createWordListRegex(
                'begin', 'break', 'catch', 'class', 'configuration', 'continue', 'data', 'define', 'do', 'dynamicparam',
                'else', 'elseif', 'end', 'enum', 'exit', 'filter', 'finally', 'for', 'foreach', 'from', 'function',
                'hidden', 'if', 'in', 'inlinescript', 'parallel', 'param', 'process', 'return', 'sequence', 'static',
                'switch', 'throw', 'trap', 'try', 'until', 'using', 'var', 'while', 'workflow'
            )
        ],
        'literal': ['\\$(?:true|True|false|False|null|Null)\\b', rNumber],
        'preprocessor': ['^[ \\t]*#(?:requires|region|endregion)\\b'],
        'string': ['@"[\\s\\S]*?"@', '@\'[\\s\\S]*?\'@', rStringSingle, rStringDouble]
    },

    // Python
    {
        'names': ['python', 'python3'],
        'builtin': [
            createWordListRegex(
                '__import__', 'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes',
                'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate',
                'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
                'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map',
                'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range',
                'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super',
                'tuple', 'type', 'vars', 'zip'
            )
        ],
        'comment': [rCommentHash],
        'keyword': [
            createWordListRegex(
                'and', 'as', 'assert', 'async', 'await', 'break', 'case', 'class', 'continue', 'def', 'del', 'elif',
                'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'match',
                'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
            )
        ],
        'literal': [createWordListRegex('False', 'True', 'None'), rNumber],
        'string': ["'''[\\s\\S]*?'''", '"""[\\s\\S]*?"""', rStringSingle, rStringDouble]
    },

    // R
    {
        'names': ['r', 'rscript', 'splus'],
        'builtin': [
            createWordListRegex(
                'abs', 'acos', 'acosh', 'all', 'any', 'anyNA', 'as.character', 'as.complex', 'as.double', 'as.integer',
                'as.logical', 'as.numeric', 'attr', 'attributes', 'c', 'call', 'ceiling', 'class', 'colnames', 'cos',
                'cosh', 'cummax', 'cummin', 'cumprod', 'cumsum', 'data.frame', 'deparse', 'dim', 'dimnames', 'exp',
                'floor', 'get', 'grep', 'grepl', 'identical', 'is.na', 'length', 'list', 'log', 'log10', 'log2', 'max',
                'mean', 'min', 'names', 'nchar', 'paste', 'paste0', 'print', 'prod', 'rbind', 'rep', 'return', 'round',
                'rownames', 'seq', 'sin', 'sinh', 'sqrt', 'sum', 'tan', 'tanh'
            )
        ],
        'comment': [rCommentHash],
        'keyword': [
            createWordListRegex('break', 'else', 'for', 'function', 'if', 'in', 'next', 'repeat', 'while')
        ],
        'literal': [
            createWordListRegex('FALSE', 'Inf', 'NA', 'NA_character_', 'NA_complex_', 'NA_integer_', 'NA_real_', 'NaN', 'NULL', 'TRUE'),
            rNumber
        ],
        'string': [rStringSingle, rStringDouble]
    },

    // Ruby
    {
        'names': ['ruby', 'rb', 'jruby', 'macruby', 'rake', 'rbx'],
        'builtin': [
            createWordListRegex(
                'Array', 'Class', 'Dir', 'File', 'Hash', 'Integer', 'Module', 'Object', 'String', 'lambda', 'print',
                'proc', 'puts', 'raise', 'require', 'require_relative'
            )
        ],
        'comment': [rCommentHash, '=begin\\b[\\s\\S]*?^=end\\b'],
        'keyword': [
            createWordListRegex(
                'alias', 'and', 'begin', 'break', 'case', 'class', 'def', 'do', 'else', 'elsif', 'end', 'ensure',
                'false', 'if', 'module', 'nil', 'not', 'or', 'rescue', 'return', 'self', 'super', 'then', 'true',
                'unless', 'until', 'when', 'while', 'yield'
            )
        ],
        'literal': [rNumber, ':[a-zA-Z_][a-zA-Z0-9_]*\\b'],
        'preprocessor': [
            '^[ \\t]*(?:__END__|require|include|extend)\\b',
            '@{1,2}[a-zA-Z_][a-zA-Z0-9_]*\\b'
        ],
        'string': [rStringSingle, rStringDouble]
    },

    // Rust
    {
        'names': ['rust', 'rs'],
        'builtin': [
            createWordListRegex(
                'AsMut', 'AsRef', 'Box', 'Clone', 'Copy', 'Default', 'Drop', 'Err', 'ExactSizeIterator', 'Extend', 'Fn',
                'FnMut', 'FnOnce', 'From', 'Iterator', 'None', 'Ok', 'Option', 'Ord', 'PartialEq', 'PartialOrd',
                'Result', 'Send', 'Sized', 'Some', 'String', 'Sync', 'ToOwned', 'Vec', 'assert', 'assert_eq',
                'assert_ne', 'cfg', 'column', 'concat', 'concat_idents', 'debug_assert', 'debug_assert_eq',
                'debug_assert_ne', 'env', 'eprint', 'eprintln', 'file', 'format', 'format_args', 'include',
                'include_bytes', 'include_str', 'line', 'module_path', 'option_env', 'panic', 'print', 'println',
                'stringify', 'thread_local', 'todo', 'unimplemented', 'unreachable', 'vec', 'write', 'writeln'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'Self', 'abstract', 'as', 'async', 'await', 'become', 'bool', 'box', 'break', 'char', 'const',
                'continue', 'crate', 'do', 'dyn', 'else', 'enum', 'extern', 'final', 'fn', 'for', 'f32', 'f64', 'if',
                'impl', 'in', 'i128', 'i16', 'i32', 'i64', 'i8', 'int', 'isize', 'let', 'loop', 'macro', 'match', 'mod',
                'move', 'mut', 'override', 'priv', 'pub', 'ref', 'return', 'self', 'static', 'str', 'struct', 'super',
                'trait', 'try', 'type', 'typeof', 'u128', 'u16', 'u32', 'u64', 'u8', 'uint', 'unsafe', 'unsized', 'use',
                'usize', 'virtual', 'where', 'while', 'yield'
            )
        ],
        'literal': [createWordListRegex('false', 'true'), rNumber],
        'preprocessor': ['#\\!?\\[.*?\\]'],
        'string': [
            rStringSingle,
            rStringDouble,
            'b"(?:[^"\\\\]|\\\\.)*"',
            'br"(?:[^"])*"',
            'br#"(?:[^"]|"(?!#))*"#',
            'br##"(?:[^"]|"(?!##))*"##',
            'r"(?:[^"])*"',
            'r#"(?:[^"]|"(?!#))*"#',
            'r##"(?:[^"]|"(?!##))*"##'
        ]
    },

    // Schema Markdown
    {
        'names': ['schema-markdown'],
        'builtin': [
            createWordListRegex('bool', 'date', 'datetime', 'float', 'int', 'object', 'string', 'uuid')
        ],
        'comment': [rCommentHash],
        'keyword': [
            createWordListRegex(
                'action', 'enum', 'errors', 'group', 'input', 'nullable', 'optional', 'output', 'path', 'query',
                'struct', 'typedef', 'union', 'urls'
            )
        ],
        'string': [rStringDouble]
    },

    // Shell
    {
        'names': ['shell', 'sh', 'bash', 'zsh'],
        'builtin': [
            createWordListRegex('alias', 'declare', 'echo', 'exit', 'export', 'let', 'set', 'unset')
        ],
        'comment': [rCommentHash],
        'keyword': [
            createWordListRegex(
                'break', 'case', 'continue', 'do', 'done', 'elif', 'else', 'esac', 'fi', 'for', 'function', 'if', 'in',
                'return', 'then', 'until', 'while'
            )
        ],
        'string': [rStringSingle, rStringDouble]
    },

    // SQL
    {
        'names': ['sql', 'plsql', 'tsql'],
        'builtin': [
            createWordListRegex(
                'ABS', 'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'AVG', 'BIGINT', 'BINARY', 'BLOB', 'BOOLEAN', 'CAST', 'CEIL',
                'CEILING', 'CHAR', 'COALESCE', 'CONCAT', 'COS', 'COUNT', 'CURRENT_DATE', 'CURRENT_TIME',
                'CURRENT_TIMESTAMP', 'DATE', 'DATETIME', 'DECIMAL', 'DOUBLE', 'EXP', 'FLOAT', 'FLOOR', 'INT', 'INTEGER',
                'LENGTH', 'LN', 'LOG', 'LOG10', 'LOWER', 'MAX', 'MIN', 'NCHAR', 'NOW', 'NUMERIC', 'PI', 'POWER', 'RAND',
                'REAL', 'ROUND', 'SIN', 'SMALLINT', 'SQRT', 'SUM', 'TAN', 'TEXT', 'TIME', 'TIMESTAMP', 'TRIM', 'UPPER',
                'VARCHAR',

                // SQL builtins are case-insensitive so include lowercase versions
                'abs', 'acos', 'asin', 'atan', 'atan2', 'avg', 'bigint', 'binary', 'blob', 'boolean', 'cast', 'ceil',
                'ceiling', 'char', 'coalesce', 'concat', 'cos', 'count', 'current_date', 'current_time',
                'current_timestamp', 'date', 'datetime', 'decimal', 'double', 'exp', 'float', 'floor', 'int', 'integer',
                'length', 'ln', 'log', 'log10', 'lower', 'max', 'min', 'nchar', 'now', 'numeric', 'pi', 'power', 'rand',
                'real', 'round', 'sin', 'smallint', 'sqrt', 'sum', 'tan', 'text', 'time', 'timestamp', 'trim', 'upper',
                'varchar'
            )
        ],
        'comment': ['--.*$', rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'ADD', 'ALL', 'ALTER', 'AND', 'AS', 'ASC', 'BETWEEN', 'CASE', 'CHECK', 'CREATE', 'DATABASE', 'DELETE',
                'DESC', 'DISTINCT', 'DROP', 'EXISTS', 'FROM', 'GROUP', 'HAVING', 'IN', 'INSERT', 'INTO', 'IS', 'JOIN',
                'LIKE', 'LIMIT', 'NOT', 'NULL', 'ON', 'OR', 'ORDER', 'SELECT', 'SET', 'TABLE', 'UNION', 'UPDATE',
                'VALUES', 'WHERE',

                // SQL builtins are case-insensitive so include lowercase versions
                'add', 'all', 'alter', 'and', 'as', 'asc', 'between', 'case', 'check', 'create', 'database', 'delete',
                'desc', 'distinct', 'drop', 'exists', 'from', 'group', 'having', 'in', 'insert', 'into', 'is', 'join',
                'like', 'limit', 'not', 'null', 'on', 'or', 'order', 'select', 'set', 'table', 'union', 'update',
                'values', 'where'
            )
        ],
        'literal': [createWordListRegex('FALSE', 'NULL', 'TRUE'), rNumber],
        'string': ["'(?:[^']|'')*'"]
    },

    // Swift
    {
        'names': ['swift'],
        'builtin': [
            createWordListRegex(
                'abs', 'acos', 'asin', 'assert', 'atan', 'atan2', 'cos', 'cosh', 'debugPrint', 'dump', 'exp', 'exp2',
                'fabs', 'fatalError', 'floor', 'fmod', 'log', 'log10', 'log2', 'max', 'min', 'numericCast', 'pow',
                'precondition', 'print', 'readLine', 'reduce', 'round', 'sin', 'sinh', 'sort', 'sqrt', 'stride', 'swap',
                'tan', 'tanh', 'type(of)', 'unsafeBitCast', 'withUnsafeBytes', 'withUnsafePointer', 'zip'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'Any', 'AnyClass', 'AnyObject', 'Array', 'ArraySlice', 'Bool', 'Character', 'ClosedRange', 'Dictionary',
                'Double', 'Error', 'Float', 'Float80', 'Int', 'Int16', 'Int32', 'Int64', 'Int8', 'Never', 'Optional',
                'Range', 'Self', 'Set', 'String', 'Substring', 'Type', 'UInt', 'UInt16', 'UInt32', 'UInt64', 'UInt8',
                'UnsafeBufferPointer', 'UnsafeMutableBufferPointer', 'UnsafeMutablePointer',
                'UnsafeMutableRawBufferPointer', 'UnsafeMutableRawPointer', 'UnsafePointer', 'UnsafeRawBufferPointer',
                'UnsafeRawPointer', 'Void', 'as', 'associatedtype', 'associativity', 'break', 'case', 'catch', 'class',
                'continue', 'convenience', 'default', 'defer', 'deinit', 'didSet', 'do', 'dynamic', 'else', 'enum',
                'extension', 'fallthrough', 'fileprivate', 'final', 'for', 'func', 'get', 'guard', 'if', 'import', 'in',
                'indirect', 'infix', 'init', 'inout', 'internal', 'is', 'lazy', 'left', 'let', 'mutating', 'none',
                'nonmutating', 'open', 'operator', 'optional', 'override', 'postfix', 'precedence', 'prefix', 'private',
                'protocol', 'public', 'rethrows', 'required', 'return', 'right', 'self', 'set', 'static', 'struct',
                'subscript', 'super', 'switch', 'throw', 'throws', 'try', 'typealias', 'unowned', 'var', 'weak',
                'where', 'while', 'willSet'
            )
        ],
        'literal': [createWordListRegex('false', 'nil', 'true'), rNumber],
        'preprocessor': [
            `#(?:${[
                'available', 'colorLiteral', 'column', 'dsohandle', 'else', 'elseif', 'endif', 'error', 'file',
                'fileID', 'fileLiteral', 'filePath', 'function', 'if', 'imageLiteral', 'keyPath', 'line', 'selector',
                'sourceLocation', 'warning'
            ].join('|')})\\b`
        ],
        'string': ['"""[\\s\\S]*?"""', rStringDouble]
    },

    // SystemVerilog
    {
        'names': ['systemverilog', 'verilog'],
        'builtin': [
            createWordListRegex(
                '$bits', '$bitstoreal', '$bitstoshortreal', '$cast', '$countbits', '$countones', '$display', '$error',
                '$exit', '$fatal', '$fell', '$feof', '$fgets', '$finish', '$floor', '$fopen', '$fscanf', '$fwrite',
                '$getc', '$high', '$increment', '$info', '$isunbounded', '$isunknown', '$left', '$length', '$low',
                '$monitor', '$onehot', '$onehot0', '$random', '$readmemb', '$readmemh', '$realtime', '$realtobits',
                '$right', '$rose', '$sampled', '$shortrealtobits', '$signed', '$size', '$stable', '$stop', '$strobe',
                '$system', '$test$plusargs', '$time', '$timeformat', '$timescale', '$typename', '$undefined',
                '$unsigned', '$urandom', '$urandom_range', '$value$plusargs', '$warning', '$width', '$write'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'accept_on', 'alias', 'always', 'always_comb', 'always_ff', 'always_latch', 'and', 'assert', 'assign',
                'assume', 'automatic', 'before', 'begin', 'bind', 'bins', 'binsof', 'bit', 'break', 'buf', 'bufif0',
                'bufif1', 'byte', 'case', 'casex', 'casez', 'cell', 'chandle', 'checker', 'class', 'clocking', 'cmos',
                'config', 'const', 'constraint', 'context', 'continue', 'cover', 'covergroup', 'coverpoint', 'cross',
                'deassign', 'default', 'defparam', 'design', 'disable', 'dist', 'do', 'edge', 'else', 'end', 'endcase',
                'endchecker', 'endclass', 'endclocking', 'endconfig', 'endfunction', 'endgenerate', 'endgroup',
                'endinterface', 'endmodule', 'endpackage', 'endprimitive', 'endprogram', 'endproperty', 'endsequence',
                'endspecify', 'endtable', 'endtask', 'enum', 'event', 'eventually', 'expect', 'export', 'extends',
                'extern', 'final', 'first_match', 'for', 'force', 'foreach', 'forever', 'fork', 'forkjoin', 'function',
                'generate', 'genvar', 'global', 'highz0', 'highz1', 'if', 'iff', 'ifnone', 'ignore_bins',
                'illegal_bins', 'implements', 'implies', 'import', 'incdir', 'include', 'initial', 'inout', 'input',
                'inside', 'instance', 'int', 'integer', 'interface', 'intersect', 'join', 'join_any', 'join_none',
                'large', 'let', 'liblist', 'library', 'local', 'localparam', 'logic', 'longint', 'macromodule',
                'matches', 'medium', 'modport', 'module', 'nand', 'negedge', 'nettype', 'new', 'nexttime', 'nmos',
                'nor', 'noshowcancelled', 'not', 'notif0', 'notif1', 'null', 'or', 'output', 'package', 'packed',
                'parameter', 'pmos', 'posedge', 'primitive', 'priority', 'program', 'property', 'protected', 'pull0',
                'pull1', 'pulldown', 'pullup', 'pulsestyle_ondetect', 'pulsestyle_onevent', 'pure', 'rand', 'randc',
                'randcase', 'randsequence', 'rcmos', 'real', 'realtime', 'ref', 'reg', 'reject_on', 'release', 'repeat',
                'restrict', 'return', 'rnmos', 'rpmos', 'rtran', 'rtranif0', 'rtranif1', 's_always', 's_eventually',
                's_nexttime', 's_until', 's_until_with', 'scalared', 'sequence', 'shortint', 'shortreal',
                'showcancelled', 'signed', 'small', 'solve', 'specify', 'specparam', 'static', 'string', 'strong',
                'strong0', 'strong1', 'struct', 'super', 'supply0', 'supply1', 'sync_accept_on', 'sync_reject_on',
                'table', 'tagged', 'task', 'this', 'throughout', 'time', 'timeprecision', 'timeunit', 'tran', 'tranif0',
                'tranif1', 'tri', 'tri0', 'tri1', 'triand', 'trior', 'trireg', 'type', 'typedef', 'union', 'unique',
                'unique0', 'unsigned', 'until', 'until_with', 'untyped', 'use', 'uwire', 'var', 'vectored', 'virtual',
                'void', 'wait', 'wait_order', 'wand', 'weak', 'weak0', 'weak1', 'while', 'wildcard', 'wire', 'with',
                'within', 'wor', 'xnor', 'xor'
            )
        ],
        'literal': [
            // Special tick values
            "'[01xXzZ]\\b",
            // Boolean literals and null
            createWordListRegex('1step', 'FALSE', 'TRUE', 'false', 'true', 'null'),
            // Real numbers with optional exponents
            '\\b\\d+(?:_\\d+)*\\.\\d+(?:_\\d+)*(?:e[-+]?\\d+(?:_\\d+)*)?\\b',
            // Based numbers with size specification
            "\\b\\d+(?:_\\d+)*'[sS]?[bBoOdDhH][0-9a-fA-F_xXzZ]+\\b",
            // Based numbers without size (default 32-bit)
            "'[sS]?[bBoOdDhH][0-9a-fA-F_xXzZ]+\\b",
            // Basic numbers
            '\\b\\d+(?:_\\d+)*\\b'
        ],
        'preprocessor': [
            `^[ \\t]*\`(?:${[
                'begin_keywords', 'celldefine', 'default_nettype', 'define', 'else', 'elsif', 'end_keywords',
                'endcelldefine', 'endif', 'ifdef', 'ifndef', 'include', 'line', 'nounconnected_drive', 'pragma',
                'resetall', 'timescale', 'unconnected_drive', 'undef', 'undefineall'
            ].join('|')})\\b`
        ],
        'string': [rStringSingle, rStringDouble]
    },

    // TypeScript
    {
        'names': ['typescript', 'ts'],
        'builtin': [
            createWordListRegex(
                'AbortController', 'AbortSignal', 'Array', 'ArrayBuffer', 'AsyncGenerator', 'AsyncGeneratorFunction',
                'AsyncIterable', 'AsyncIterableIterator', 'Atomics', 'Awaited', 'BigInt', 'BigInt64Array',
                'BigUint64Array', 'Boolean', 'Capitalize', 'DataView', 'Date', 'Error', 'EvalError', 'Exclude',
                'Extract', 'Float32Array', 'Float64Array', 'Function', 'Generator', 'GeneratorFunction', 'Infinity',
                'InstanceType', 'Int16Array', 'Int32Array', 'Int8Array', 'Intl', 'JSON', 'Lowercase', 'Map', 'Math',
                'NaN', 'NonNullable', 'Number', 'Object', 'Omit', 'Parameters', 'Partial', 'Pick', 'Promise', 'Proxy',
                'RangeError', 'Readonly', 'Record', 'ReferenceError', 'Reflect', 'RegExp', 'Required', 'ReturnType',
                'Set', 'SharedArrayBuffer', 'String', 'Symbol', 'SyntaxError', 'ThisType', 'TypeError', 'URIError',
                'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray', 'Uncapitalize', 'Uppercase', 'WeakMap',
                'WeakSet', 'console'
            )
        ],
        'comment': [rCommentSlashSlash, rCommentSlashStar],
        'keyword': [
            createWordListRegex(
                'abstract', 'any', 'as', 'asserts', 'async', 'await', 'boolean', 'break', 'case', 'catch', 'class',
                'const', 'constructor', 'continue', 'debugger', 'declare', 'default', 'delete', 'do', 'else', 'enum',
                'export', 'extends', 'finally', 'for', 'from', 'function', 'get', 'global', 'if', 'implements',
                'import', 'in', 'infer', 'instanceof', 'interface', 'is', 'keyof', 'let', 'module', 'namespace',
                'never', 'new', 'of', 'package', 'private', 'protected', 'public', 'readonly', 'require', 'return',
                'set', 'static', 'super', 'switch', 'this', 'throw', 'try', 'type', 'typeof', 'unique', 'unknown',
                'var', 'void', 'while', 'with', 'yield'
            )
        ],
        'literal': [createWordListRegex('true', 'false', 'null', 'undefined'), rNumber],
        'preprocessor': ['@\\w+'],
        'string': [rStringSingle, rStringDouble, '`(?:[^`\\\\]|\\\\[\\s\\S])*`']
    },

    // XML
    {
        'names': ['xml', 'rss', 'xsd', 'wsdl'],
        'comment': ['<!--[\\s\\S]*?-->'],
        'literal': ['&#[0-9]+;', '&(?:amp|apos|gt|lt|quot);'],
        'preprocessor': [
            '<\\?.*?\\?>',
            '<!DOCTYPE[^>]*>',
            '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>'
        ],
        'string': [rStringSingle, rStringDouble],
        'tag': ['<\\/?\\s*(?:[A-Za-z_][A-Za-z0-9_.:-]*)']
    },

    // YAML
    {
        'names': ['yaml', 'yml'],
        'comment': [rCommentHash],
        'literal': [
            createWordListRegex(
                'false', 'False', 'FALSE', 'no', 'No', 'NO', 'null', 'Null', 'NULL', 'off', 'Off', 'OFF',
                'on', 'On', 'ON', 'true', 'True', 'TRUE', 'yes', 'Yes', 'YES', '~'
            ),
            // Dates (ISO 8601) - must come before numbers!
            '\\d{4}-\\d{2}-\\d{2}(?:T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[-+]\\d{2}:?\\d{2})?)?',
            rNumber
        ],
        'string': [rStringSingle, rStringDouble],
        'tag': ['^[ \\t]*.+?:\\s', '^[ \\t]*-\\s']
    }
]);
