# AGENTS.md

Notes for coding agents working in this repository.

## Dual-port rule (mandatory)

markdown-model (this repo) is the **native JavaScript** Markdown parser/renderer. A **BareScript
port** lives in the include library shared by `bare-script` and `bare-script-py`:

| Role | Location |
| --- | --- |
| JavaScript (this repo) | `lib/parser.js`, `lib/model.js`, `lib/elements.js`, `lib/highlight.js` |
| BareScript | `../bare-script/lib/include/markdownParser.bare`, `markdown.bare`, `markdownElements.bare`, `markdownHighlight.bare` |
| BareScript (Python tree) | same `.bare` files under `../bare-script-py/src/bare_script/include/` (synced via `make sync`, do not hand-edit) |

**Any behavioral, structural, test, or algorithm change in one must be implemented in the other
in the same working session.** Never land a parser/renderer/highlighter change on only one side.

The ports should stay as close to line-for-line identical as the languages allow for the **shared
core**: control flow, branching order, regex, highlight language tables, element-model shape, and
test cases (adapted only for language idioms). Prefer structural parity over a JS-only rewrite.

The two BareScript trees share one copy of the `.bare` sources. Edit them in `../bare-script/`, run
`make test-include`, then `make -C ../bare-script sync` to push to the Python repo. Do not hand-edit
the Python tree's copies. Each repo has its own `make commit` gate.

### Host-language carve-out (allowed differences)

| Area | JavaScript (this repo) | BareScript |
| --- | --- | --- |
| Naming | `parseMarkdown`, `escapeMarkdownText`, `getMarkdownTitle`, `markdownElements`, `codeBlockElements` | `markdownParse`, `markdownEscape`, `markdownTitle`, `markdownElements`, `markdownHighlightCodeBlockElements` |
| Type names | `Paragraph`, `Span`, `Highlight`, … | `MarkdownParagraph`, `MarkdownSpan`, `MarkdownHighlight`, … (prefixed to avoid include collisions) |
| `parseMarkdown` args | `(string\|string[], startLineNumber=1)`; null entries skipped | `markdownParse(lines...)` then `arrayFlat` |
| `usedHeaderIds` | `Set` | plain object used as a set |
| Copy UI | `copyLinks` boolean; SVG uses `markdown-model-no-print` and `--markdown-model-color-*` | same option; `barescript-no-print` and `--barescript-color-*` |
| CSS | `static/markdown-model.css` (`--markdown-model-dark-mode` calc) | `static/markdown.css` (`light-dark()`, `color-scheme`) |
| Async | `markdownElementsAsync` awaits Promise-returning `codeBlocks` functions | separate `markdownElementsAsync` / `markdownHighlightCodeBlockElementsAsync` |
| Validation extras | `validateMarkdownModel` throws | also `markdownValidateEx` (non-throwing) |
| Nested helpers | `closeParagraph` may be a closure over parse state | named top-level function (no nested closures) |
| Code-block line join | preserve a line's existing trailing newline, else append `\n` | `arrayJoin(lines, '\n') + '\n'` |
| Tests / lint | `node --test`, eslint, c8 | `unittest.bare`; `make test-include` |

### Parallel modules

| JavaScript | BareScript | Role |
| --- | --- | --- |
| `lib/parser.js` | `markdownParser.bare` (+ `markdownEscape` / `markdownTitle` / `markdownParagraphText` / `markdownHeaderId` in `markdown.bare`) | Parse GFM → Markdown model; title/escape helpers |
| `lib/model.js` | `markdown.bare` (`markdownTypes`, `markdownValidate`) | Schema Markdown type model |
| `lib/elements.js` | `markdownElements.bare` | Markdown model → element model |
| `lib/highlight.js` | `markdownHighlight.bare` | Fenced-code highlighting + copy button |
| `test/testParser.js`, `testParserSpans.js` | `test/testMarkdownParser.bare`, `testMarkdownParserSpans.bare`, `testMarkdown.bare` | Parser / model tests |
| `test/testElements.js` | `test/testMarkdownElements.bare` | Renderer tests |
| `test/testHighlight*.js` | `test/testMarkdownHighlight*.bare` | Highlighter tests |

**Workflow:** when editing either port, open the paired file and apply the change in both before
considering the work done. Run `make test` (and ideally `make commit`) here, and `make test-include`
in `../bare-script/` (then `make -C ../bare-script sync`).

## Overview

markdown-model is a JavaScript (ESM) Markdown parser and renderer. It parses
[GitHub Flavored Markdown](https://github.github.com/gfm/) (except HTML blocks;
inline `<br>` is supported) into a plain-object **Markdown model**, and renders
that model to an [element-model](https://github.com/craigahobbs/element-model)
tree. The type model is Schema Markdown in `lib/model.js`.

Public entry points (import from `markdown-model/lib/...`):

| Module | Exports |
| --- | --- |
| `lib/parser.js` | `parseMarkdown`, `getMarkdownTitle`, `getMarkdownParagraphText`, `escapeMarkdownText` |
| `lib/model.js` | `validateMarkdownModel`, `markdownModelTypes` |
| `lib/elements.js` | `markdownElements`, `markdownElementsAsync`, `markdownHeaderId` |
| `lib/highlight.js` | `codeBlockElements`, `compileHighlightModels`, `highlightTypes` |

The npm package also ships `static/markdown-model.css` (theme and highlight
colors). The only runtime dependency is `schema-markdown`; `element-model` is a
dev dependency used by tests (and by applications that actually draw the tree).

## javascript-build

This is a [javascript-build](https://github.com/craigahobbs/javascript-build#readme) package. Read the javascript-build skill before running tests, lint, coverage, or changing the Makefile: [`../javascript-build/SKILL.md`](../javascript-build/SKILL.md) if that file exists, otherwise [https://raw.githubusercontent.com/craigahobbs/javascript-build/main/SKILL.md](https://raw.githubusercontent.com/craigahobbs/javascript-build/main/SKILL.md).

Local Makefile overrides:

- `doc` copies `static/*` into `build/doc/` and writes
  `build/doc/model/model.json` (`highlightTypes` + `markdownModelTypes`) for the
  published Schema Markdown model docs.

There is no `USE_JSDOM`. Tests assert on element-model objects, not a DOM.

## Architecture

Pipeline: Markdown text → `parseMarkdown` → Markdown model → `markdownElements`
→ element model → `renderElements` (from element-model, not this package).

### `lib/model.js`

Schema Markdown for `Markdown` / `MarkdownPart` / `Span` / …, parsed at module
load. `validateMarkdownModel` is `validateType(..., 'Markdown', ...)`. Changing
the schema is a model-contract change: update parser output, renderer, tests,
and schema comments (they become the published model docs).

Parts and spans are **single-key unions** (`{paragraph: …}`, `{text: …}`,
`{br: 1}`, `{hr: 1}`).

### `lib/parser.js`

Line-oriented GFM subset: ATX and setext headings, lists, block quotes, fenced
and indented code, tables, thematic breaks, link-reference definitions, then
span parsing (emphasis, strikethrough, code, links/images including
reference and autolink forms, hard breaks and `<br>`). Lists and quotes recurse
through `parseMarkdownInternal` and share the top-level `linkRefs` so reference
definitions resolve across nested blocks.

`parseMarkdown(markdown, startLineNumber = 1)` accepts a string or an array of
strings (null entries skipped). `startLineNumber` is stored on code blocks.

After each span regex match, update the search index immediately and `continue`
from the common cases (bold, italic, code, link, …) before rare nested
link-image forms — same order as `markdownParser.bare`. Skip escape/entity
rewrites when the text has no `\\` or `&`.

### `lib/elements.js`

Walks the model into element-model HTML. `markdownElementsAsync` is the same
walk with `await` so an options `codeBlocks` function may be async.

Options (`MarkdownElementsOptions`):

- `codeBlocks` — language → render function (overrides builtins)
- `copyLinks` — if true, fenced code blocks get an inline SVG copy button
  (mutates `options.copyLinksIndex`, default 1)
- `urlFn` — rewrite link/image URLs and header-id hash URLs
- `headerIds` / `usedHeaderIds` — GitHub-style `id` on headings via
  `markdownHeaderId` (`usedHeaderIds` is a `Set`)

Walk unions by member access (`part.list`, `span.text`), not `Object.keys`, and
check common span kinds first. Keep that dispatch in lockstep with
`markdownElements.bare`.

### `lib/highlight.js`

`codeBlockElements` picks `options.codeBlocks[language]`, else a builtin from
`compileHighlightModels`, else a plain `<pre><code>`. Highlighters compile to
**one named-group aggregate regex** (`(?<keyword>…)|(?<string>…)|…`, `gm`);
match color is `var(--markdown-model-color-highlight-<member>)`. Iterate with
`matchAll` and an index — do not slice the remaining text (that breaks `^` /
`$` with the `m` flag).

Adding a language is a new object in the `highlightBuiltin` array plus a golden
test. Adding a *category* also needs the Highlight schema, `highlightMemberNames`,
the named-group `if` chain, and a CSS variable. The BareScript highlighter's
`builtin` list is a keyword snapshot for coloring, not a runtime dependency on
BareScript.

`copyLinks` wraps the `<code>` and an SVG clipboard icon as children of `<pre>`
(`display: flex`). Host-only names: class `markdown-model-no-print`, fill
`var(--markdown-model-color-border)`.

Highlight tests are split (`testHighlight.js`, `testHighlight2.js`,
`testHighlight3.js`) because the golden element trees are large.

### Docs and CSS

- `static/markdown-model.css` — shipped on npm; `--markdown-model-dark-mode`
  (`0` or `1`) drives light/dark via `calc`
- `static/model/index.html` — MarkdownUp shell that loads `model.json` from
  `make doc`

## Tests

`node --test` under `test/`. Parser tests call `validateMarkdownModel` on the
parse result and `assert.deepEqual` the model. Renderer tests call
`validateElements` from element-model on the output. Keep both: a shape that
passes `deepEqual` can still fail the schema (or the element-model validator).

`TEST=` is a `node --test --test-name-pattern` (see the javascript-build skill).
