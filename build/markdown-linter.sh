#!/bin/bash

# This script is intended to be run from NPM as it requires markdownlint node binary
function lintFiles {
  EXCLUDE_FILES="version.md"

  # Find all .md files in datalab/docs directory, excluding those within node modules and the _book sub-directories.
  MD_DOC_FILES=`find . -type d \( -path ./node_modules -o -path ./_book \) -prune -o -name '*.md' -print | grep -v $EXCLUDE_FILES`

  markdownlint $MD_DOC_FILES
}

lintFiles
