#!/bin/bash
set -e

GIT_DESCRIBE=`git describe --tags --always`

if [[ ($# -eq 1 || $# -eq 2 && $2 == "--push" ) ]] && [[ "$1" =~ ^(docs|api|app|infrastructure|authorisation)$ ]]; then
  case "$1" in
  docs)
    echo "Starting to build documents..."
    cd ./docs && yarn install && yarn dist
    DOCKERFILE="Dockerfile"
    IMAGE="docs"
    ;;
  api)
    echo "Starting to build datalab-api..."
    cd ./code/datalab-app && yarn install && yarn dist-create && yarn build-api
    DOCKERFILE="api.Dockerfile"
    IMAGE="datalab-api"
    ;;
  app)
    echo "Starting to build datalab-app..."
    cd ./code/datalab-app && yarn install && yarn dist-create && yarn build-app
    DOCKERFILE="app.Dockerfile"
    IMAGE="datalab-app"
    ;;
  infrastructure)
    echo "Starting to build infrastructure-api..."
    cd ./code/infrastructure-api && yarn install && yarn dist
    DOCKERFILE="Dockerfile"
    IMAGE="infrastructure-api"
    ;;
  authorisation)
    echo "Starting to build auth-service..."
    cd ./code/auth-service && yarn install && yarn dist
    DOCKERFILE="Dockerfile"
    IMAGE="authorisation-svc"
    ;;
  esac
  echo "Generating docker image..."
  docker build -f $DOCKERFILE -t nercceh/$IMAGE:latest .
  docker tag nercceh/$IMAGE:latest nercceh/$IMAGE:$GIT_DESCRIBE
  if [ "$#" -eq 2 ]; then
    echo "Attempting to push image..."
    docker push nercceh/$IMAGE
  fi
  echo "Success!"
else
  echo "Bad Args"
fi
