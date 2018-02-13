#!/bin/bash
set -e

if [[ `docker-machine status` == "Stopped" ]]; then
  echo "Starting docker machine"
  docker-machine start
fi

export DOCKER_ADDRESS=`docker-machine ip`
echo "Docker machine running on: ${DOCKER_ADDRESS}"
eval $(docker-machine env)
