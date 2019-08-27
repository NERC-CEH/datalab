#!/bin/bash
set -e

GIT_DESCRIBE=`git describe --tags --always`

if [[ ($# -eq 1 || $# -eq 2 && $2 == "--push" ) ]] && [[ "$1" =~ ^(docs|api|app|infrastructure|authorisation)$ ]]; then
  case "$1" in
  docs)
    echo "Starting to build documents..."
    cd ./docs && yarn dist
    DOCKERFILE="Dockerfile"
    IMAGE="docs"
    LIBRARY="common"
    WORKSPACE="docs"
    ;;
  api)
    echo "Starting to build datalab-api..."
    cd ./code && yarn update-version && yarn workspace client-api build
    DOCKERFILE="api.Dockerfile"
    IMAGE="datalab-api"
    LIBRARY="common"
    WORKSPACE="client-api"
    ;;
  app)
    echo "Starting to build datalab-app..."
    cd ./code && yarn update-version && yarn workspace web-app build
    DOCKERFILE="app.Dockerfile"
    IMAGE="datalab-app"
    LIBRARY="common"
    WORKSPACE="web-app"
    ;;
  infrastructure)
    echo "Starting to build infrastructure-api..."
    cd ./code && yarn update-version && yarn workspace infrastructure-api build
    DOCKERFILE="api.Dockerfile"
    IMAGE="infrastructure-api"
    LIBRARY="common"
    WORKSPACE="infrastructure-api"
    ;;
  authorisation)
    echo "Starting to build auth-service..."
    cd ./code && yarn update-version && yarn workspace auth-service build
    DOCKERFILE="api.Dockerfile"
    IMAGE="authorisation-svc"
    LIBRARY="common"
    WORKSPACE="authorisation-svc"
    ;;
  esac
  echo "Generating docker image..."
  docker build -f $DOCKERFILE -t nerc/$IMAGE:latest --build-arg LIBRARY=$LIBRARY --build-arg WORKSPACE=$WORKSPACE .
  docker tag nerc/$IMAGE:latest nerc/$IMAGE:$GIT_DESCRIBE
  if [ "$#" -eq 2 ]; then
    echo "Attempting to push image..."
    docker push nerc/$IMAGE
  fi
  echo "Success!"
else
  echo "Bad Args"
fi
