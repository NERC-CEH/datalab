#!/bin/bash

# This script is intended to be run from NPM as
function lintFiles {
  EXCLUDE_FILES="version.md"

  MD_DOC_FILES=`find . -type d \( -path ./node_modules -o -path ./_book \) -prune -o -name '*.md' -print | grep -v $EXCLUDE_FILES`

  markdownlint $MD_DOC_FILES
}

lintFiles
