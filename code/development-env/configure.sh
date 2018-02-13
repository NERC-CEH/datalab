#!/bin/bash
set -e

# Default environment variables
DATABASE_HOST="localhost"
KUBERNETES_NAMESPACE="test"
VAULT_TOKEN="root"

# Start docker-machine and set address
if [[ ($# -eq 1 && $1 == "--machine") ]]; then
  source ./scripts/start-docker-machine.sh
fi

# Set env variables dependant on docker
DATABASE_HOST=${DOCKER_ADDRESS}
VAULT_API="http://${DOCKER_ADDRESS}:8200"

# Start mongo and vault containers. Pre-seed database with values.
(docker-compose -f ./docker/docker-compose.yml up -d)

# Set vault role value
source ./scripts/configure-vault.sh

# Start minikube and set address
if [[ `minikube status --format {{.MinikubeStatus}}` == "Stopped" ]]; then
  minikube start
  minikube addons enable ingress
fi

MINIKUBE_IP=`minikube ip`

# Get kube-dns address
CLUSTER_DNS=`kubectl get svc -n kube-system -o json | jq --raw-output '.items | .[] | select(.metadata.name | contains("kube-dns")) | .spec.clusterIP'`

# Generate dnsmasq.conf

# Create namespace
kubectl create namespace $KUBERNETES_NAMESPACE || echo namespace already present

# load TLS cert

# Load storage class

# Load ingress rules for external datalab app/api


echo $DOCKER_ADDRESS
echo $MINIKUBE_IP
echo $CLUSTER_DNS
