#!/bin/bash
set -e

if [[ ($# -eq 1 || $# -eq 2 && $2 == "--push" ) ]] && [[ "$1" =~ ^(docs|api|app)$ ]]; then
  case "$1" in
  docs)
    echo "Starting to build documents..."
    cd ./docs && gitbook build
    DOCKERFILE="Dockerfile"
    IMAGE="docs"
    ;;
  api)
    echo "Starting to build datalab-api..."
    cd ./code/datalab-app && yarn dist-create && yarn build-api
    DOCKERFILE="api.Dockerfile"
    IMAGE="datalab-api"
    ;;
  app)
    echo "Starting to build datalab-app..."
    cd ./code/datalab-app && yarn dist-create && yarn build-app
    DOCKERFILE="app.Dockerfile"
    IMAGE="datalab-app"
    ;;
  esac
  echo "Generating docker image..."
  docker build -f $DOCKERFILE -t nerc/$IMAGE .
  if [ "$#" -eq 2 ]; then
    echo "Attempting to push image..."
    docker push nerc/$IMAGE
  fi
  echo "Success!"
else
  echo "Bad Args"
fi
