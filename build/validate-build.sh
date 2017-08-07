#!/bin/bash
set -e

if [[ $# -eq 1 ]] && [[ "$1" =~ ^(docs|api|app)$ ]]; then
  case "$1" in
    docs)
      cd ./docs && yarn install && yarn lint
      ;;
    api)
      cd ./code/datalab-app && yarn install && yarn lint-api && CI=true yarn test
      ;;
    app)
      cd ./code/datalab-app && yarn install && yarn lint-app && CI=true yarn test
      ;;
  esac
else
  echo "Bad Args"
fi
