#!/bin/bash
set -e

# echo "Fetching recent git history"
# git fetch --shallow-exclude 0.30.0
# git repack -d
# git fetch --deepen=1
GIT_DESCRIBE=`git describe --tags --always`
echo "git describe $GIT_DESCRIBE"

if [[ ($# -eq 1 || $# -eq 2 && $2 == "--push" ) ]] && [[ "$1" =~ ^(docs|api|app|infrastructure|authorisation|common|chassis)$ ]]; then
  case "$1" in
  docs)
    echo "Starting to build documents..."
    cd ./docs && yarn update-version
    DOCKERFILE="docs.Dockerfile"
    IMAGE="docs"
    ;;
  api)
    echo "Starting to build datalab-api..."
    cd ./code && yarn update-version && yarn workspace client-api build
    DOCKERFILE="api.Dockerfile"
    IMAGE="datalab-api"
    LIBRARIES="common,service-chassis"
    WORKSPACE="client-api"
    ;;
  app)
    echo "Starting to build datalab-app..."
    cd ./code && yarn update-version && yarn workspace web-app build
    DOCKERFILE="app.Dockerfile"
    IMAGE="datalab-app"
    WORKSPACE="web-app"
    ;;
  infrastructure)
    echo "Starting to build infrastructure-api..."
    cd ./code && yarn update-version && yarn workspace infrastructure-api build
    DOCKERFILE="api.Dockerfile"
    IMAGE="infrastructure-api"
    LIBRARIES="common,service-chassis"
    WORKSPACE="infrastructure-api"
    ;;
  authorisation)
    echo "Starting to build auth-service..."
    cd ./code && yarn update-version && yarn workspace auth-service build
    DOCKERFILE="api.Dockerfile"
    IMAGE="authorisation-svc"
    LIBRARIES="common,service-chassis"
    WORKSPACE="auth-service"
    ;;
  common)
    echo "No docker build step defined for common. Skipping build."
    exit 0
    ;;
  chassis)
    echo "No docker build step defined for service-chassis. Skipping build."
    exit 0
    ;;
  esac
  echo "Generating docker image..."
  docker build -f $DOCKERFILE -t nerc/$IMAGE:latest --build-arg LIBRARIES=$LIBRARIES --build-arg WORKSPACE=$WORKSPACE .
  docker tag nerc/$IMAGE:latest nerc/$IMAGE:$GIT_DESCRIBE
  if [ "$#" -eq 2 ]; then
    echo "Attempting to push image..."
    docker push nerc/$IMAGE:$GIT_DESCRIBE
  fi
  echo "Success!"
else
  echo "Bad Args"
fi
