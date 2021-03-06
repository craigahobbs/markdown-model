// Licensed under the MIT License
// https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

/** @module lib/model */

import {SchemaMarkdownParser} from 'schema-markdown/lib/parser.js';
import {validateType} from 'schema-markdown/lib/schema.js';


/**
 * Validate a markdown model
 *
 * @param {Object} markdown - The markdown model
 * @returns {Object}
 */
export function validateMarkdownModel(markdown) {
    return validateType(markdownModelTypes, 'Markdown', markdown);
}


// The Markdown model defined using Schema Markdown
const markdownModelSmd = `\
# Markdown document struct
struct Markdown

    # The markdown document's parts
    MarkdownPart[] parts


# Markdown document part struct
union MarkdownPart

    # A paragraph
    Paragraph paragraph

    # A horizontal rule (value is ignored)
    object(nullable) hr

    # A list
    List list

    # A code block
    CodeBlock codeBlock


# Paragraph markdown part struct
struct Paragraph

    # The paragraph style
    optional ParagraphStyle style

    # The paragraph span array
    Span[len > 0] spans


# Paragraph style enum
enum ParagraphStyle
    h1
    h2
    h3
    h4
    h5
    h6


# Paragraph span struct
union Span

    # Text span
    string(len > 0) text

    # Line break (value is ignored)
    object(nullable) br

    # Style span
    StyleSpan style

    # Link span
    LinkSpan link

    # Image span
    ImageSpan image


# Style span struct
struct StyleSpan

    # The span's character style
    CharacterStyle style

    # The contained spans
    Span[len > 0] spans


# Character style enum
enum CharacterStyle
    bold
    italic


# Link span struct
struct LinkSpan

    # The link's URL
    string(len > 0) href

    # The image's title
    optional string(len > 0) title

    # The contained spans
    Span[len > 0] spans


# Image span struct
struct ImageSpan

    # The image URL
    string(len > 0) src

    # The image's alternate text
    string(len > 0) alt

    # The image's title
    optional string(len > 0) title


# List markdown part struct
struct List

    # The list is numbered and this is starting number
    optional int(>= 0) start

    # The list's items
    ListItem[len > 0] items


# List item struct
struct ListItem

    # The markdown document's parts
    MarkdownPart[len > 0] parts


# Code block markdown part struct
struct CodeBlock

    # The code block's language
    optional string(len > 0) language

    # The code block's text lines
    string[] lines

    # The code block's starting line number
    optional int(>= 1) startLineNumber
`;


/** The Markdown schema-markdown type model */
export const markdownModelTypes = (new SchemaMarkdownParser(markdownModelSmd)).types;
