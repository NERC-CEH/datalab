#!/bin/bash
set -e

if [[ $# -eq 1 ]] && [[ "$1" =~ ^(docs|api|app|proxy)$ ]]; then
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
    proxy)
      cd ./code/dynamic-proxy && yarn install && yarn lint # Add "&& yarn test" once created
      ;;
  esac
else
  echo "Bad Args"
fi
