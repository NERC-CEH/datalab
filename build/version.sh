#!/bin/bash
set -e

GIT_DESCRIBE=`git describe --tags --always`

REGEX="s/%%VERSION%%/$GIT_DESCRIBE/g"

if [ "$#" -eq 2 ]; then
  sed $REGEX $1 > $2
else
  echo "Bad args"
fi
