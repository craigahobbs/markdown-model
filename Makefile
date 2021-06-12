# Licensed under the MIT License
# https://github.com/craigahobbs/markdown-model/blob/main/LICENSE

# Download JavaScript Build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell if which wget; then wget -q $(1); else curl -Os $(1); fi)
endif
endef
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/Makefile.base))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/jsdoc.json))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/.eslintrc.cjs))

# Include JavaScript Build
include Makefile.base

# Add README.md to jsdoc args
JSDOC_ARGS := $(JSDOC_ARGS) README.md

clean:
	rm -rf Makefile.base jsdoc.json .eslintrc.cjs

doc:
	$(NODE_DOCKER) node --input-type=module \
		-e 'import {markdownModel} from "./src/markdown-model/model.js"; console.log(JSON.stringify(markdownModel))' \
		> build/doc/markdown-model.json
