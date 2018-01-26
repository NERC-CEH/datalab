#!/bin/bash
set -e

DOCKER_ADDRESS="localhost"

# Start docker-machine and set address
if [[ ($# -eq 1 && $1 == "--machine") ]]; then
  if [[ `docker-machine status` == "Stopped" ]]; then
    docker-machine start
  fi
  eval $(docker-machine env)
  DOCKER_ADDRESS=`docker-machine ip`
fi

# Start vault and set role value

# Start mongo and set database address


# Start minikube and set address
if [[ `minikube status --format {{.MinikubeStatus}}` == "Stopped" ]]; then
  minikube start
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
