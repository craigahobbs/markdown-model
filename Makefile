# Licensed under the MIT License
# https://github.com/craigahobbs/markdown-model/blob/main/LICENSE


# Download javascript-build
JAVASCRIPT_BUILD_DIR ?= ../javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
$$(shell [ -f $(JAVASCRIPT_BUILD_DIR)/$(notdir $(1)) ] && cp $(JAVASCRIPT_BUILD_DIR)/$(notdir $(1)) . || $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if command -v wget >/dev/null 2>&1; then wget -q -c $(1); else curl -f -Os $(1); fi
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/Makefile.base))
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/jsdoc.json))
$(eval $(call WGET, https://craigahobbs.github.io/javascript-build/eslint.config.js))


# Include javascript-build
include Makefile.base


clean:
	rm -rf Makefile.base jsdoc.json eslint.config.js


doc:
    # Copy statics
	cp -R static/* build/doc/

    # Generate the Markdown model documentation
	$(NODE_SHELL) node --input-type=module -e "$$MODEL_JS" > build/doc/model/model.json


# JavaScript to generate the model documentation
define MODEL_JS
import {highlightTypes} from "./lib/highlight.js";
import {markdownModelTypes} from "./lib/model.js";

console.log(JSON.stringify({...highlightTypes, ...markdownModelTypes}));
endef
export MODEL_JS
