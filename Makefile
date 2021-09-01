# Licensed under the MIT License
# https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

# Download javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if which wget; then wget -q -c $(1); else curl -Os $(1); fi
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/Makefile.base))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/jsdoc.json))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/.eslintrc.cjs))

# Include javascript-build
include Makefile.base

clean:
	rm -rf Makefile.base jsdoc.json .eslintrc.cjs

doc:
	mkdir -p build/doc/doc/
	$(NODE_DOCKER) node --input-type=module \
		-e 'import {markdownModel} from "./src/markdown-model/markdownModel.js"; console.log(JSON.stringify(markdownModel))' \
		> build/doc/doc/markdown-model.json
	(cd build/doc/doc/ && $(call WGET_CMD, https://craigahobbs.github.io/schema-markdown-doc/index.html))
	sed -E "s/\\.run\(window\);/.run(window, 'markdown-model.json');/" build/doc/doc/index.html > build/doc/doc/index.html.tmp
	mv build/doc/doc/index.html.tmp build/doc/doc/index.html
