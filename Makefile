export SHELL := /bin/bash
export PATH  := $(shell npm bin):$(PATH)

SRC_FILES  = $(wildcard src/*.js)
LIB_FILES  = $(patsubst src/%.js,lib/%.js,$(SRC_FILES))

all: $(LIB_FILES)

lib/%.js: src/%.js
	@mkdir -p $(@D)
	babel $(BABEL_OPTS) -o $@ $<

test: all test.js
	mocha -r babel-register

clean:
	rm -rf lib

.PHONY: clean
