#!/bin/bash
set -e

if [[ $# -eq 1 ]] && [[ "$1" =~ ^(docs|api|app|infrastructure)$ ]]; then
  case "$1" in
    docs)
      cd ./docs && yarn install && yarn lint
      ;;
    api)
      cd ./code/datalab-app && yarn install && yarn lint-api && yarn test-api-ci
      ;;
    app)
      cd ./code/datalab-app && yarn install && yarn lint-app && yarn test-app-ci
      ;;
    infrastructure)
      cd ./code/infrastructure-api && yarn install && yarn lint && yarn test-ci
      ;;
  esac
else
  echo "Bad Args"
fi
