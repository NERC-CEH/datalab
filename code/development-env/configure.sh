#!/bin/bash
set -e

# Default environment variables
DATABASE_HOST="localhost"
VAULT_TOKEN=root

# Start docker-machine and set address
if [[ ($# -eq 1 && $1 == "--machine") ]]; then
  source ./scripts/start-docker-machine.sh
fi

# Set env variables dependant on docker
DATABASE_HOST=${DOCKER_ADDRESS}
VAULT_API="http://${DOCKER_ADDRESS}:8200"

# Docker compose is very flaky in Windows and need to be run as single line
docker-compose -f ./docker/docker-compose-mongo.yml -f ./docker/docker-compose-vault.yml up -d

# Start mongo and pre-seed database
# docker-compose -f ./docker/docker-compose-mongo.yml up -d

# Start vault and set role value
# docker-compose -f ./docker/docker-compose-vault.yml up -d
source ./scripts/configure-vault.sh

# Start minikube and set address
if [[ `minikube status --format {{.MinikubeStatus}}` == "Stopped" ]]; then
  echo start mk
  # minikube start
  # enable ingress
  # load TLS cert
fi

MINIKUBE_IP=`minikube ip`

# Get kube-dns address

# Generate dnsmasq.conf

# Create namespace

# Load storage class

# Load ingress rules for external datalab app/api


echo $DOCKER_ADDRESS
echo $MINIKUBE_IP
