# Licensed under the MIT License
# https://github.com/craigahobbs/markdown-model/blob/main/LICENSE


# Download javascript-build
define WGET
ifeq '$$(wildcard $(notdir $(1)))' ''
$$(info Downloading $(notdir $(1)))
_WGET := $$(shell $(call WGET_CMD, $(1)))
endif
endef
WGET_CMD = if which wget; then wget -q -c $(1); else curl -f -Os $(1); fi
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/Makefile.base))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/jsdoc.json))
$(eval $(call WGET, https://raw.githubusercontent.com/craigahobbs/javascript-build/main/eslint.config.js))


# Include javascript-build
include Makefile.base


clean:
	rm -rf Makefile.base jsdoc.json eslint.config.js


doc:
    # Copy statics
	cp -R static/* build/doc/

    # Generate the Markdown model documentation
	$(NODE_DOCKER) node --input-type=module \
		-e 'import {markdownModelTypes} from "./lib/model.js"; console.log(JSON.stringify(markdownModelTypes))' \
		> build/doc/model/model.json
