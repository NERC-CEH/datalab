#!/bin/bash
set -e

if [[ $# -eq 1 ]] && [[ "$1" =~ ^(docs|api|app|infrastructure|authorisation)$ ]]; then
  case "$1" in
    docs)
      cd ./docs && yarn install && yarn lint
      ;;
    api)
      cd ./code && yarn install && yarn workspace client-api lint && yarn workspace client-api test-ci
      ;;
    app)
      cd ./code && yarn install && yarn workspace web-app lint && yarn workspace web-app test-ci
      ;;
    infrastructure)
      cd ./code && yarn install && yarn workspace infrastructure-api lint && yarn workspace infrastructure-api test-ci
      ;;
    authorisation)
      cd ./code && yarn install && yarn workspace auth-service lint && yarn workspace auth-service test-ci
      ;;
  esac
else
  echo "Bad Args"
fi
