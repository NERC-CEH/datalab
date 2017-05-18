#!/bin/bash
set -e

if [ "$#" -eq 1 ] && [ "$TRAVIS_BRANCH" = "master" -a "$TRAVIS_PULL_REQUEST" = "false" ]; then
  echo "Attemping to login to Docker Hub..."
  docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
  $TRAVIS_BUILD_DIR/build/build-container.sh $1 --push
else
  echo "Container building skipped."
fi
