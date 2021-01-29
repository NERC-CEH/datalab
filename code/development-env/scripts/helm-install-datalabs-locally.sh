#!/bin/bash

# Creates necessary secrets within the target kubernetes cluster such that a helm install
# of the datalabs chart can be installed (chart available in datalab-k8s-manifests repo).
# This script will also carry out the helm install of the datalab chart.

# The domain you are running datalabs on locally. Either datalabs.internal or datalabs.localhost.
targetDomain="datalabs.internal"
# The namespace to install the helm chart and the datalab services to
targetNamespace="devtest"
mongoPassword="datalabs-root-p"

# The path to the datalab helm chart to install. You will likely need to have a local
# of the datalabs-k8s-manifests repo to have this chart available for install.
helmChartPath="<path to datalab helm chart>"
helmDeploymentName="datalab"

# Temporary directory that will be used to generate the auth signing certificates.
# This directory is created and deleted within this script.
tempDir='./tmp'

# create mongo password secret
kubectl create secret generic mongo-password-secret -n $targetNamespace --from-literal secret="$mongoPassword"

# Create auth-signing-key secret
privateKeyFile=private_key.pem
publicKeyFile=public_key.pem
mkdir $tempDir
cd $tempDir
openssl genpkey -algorithm RSA -out $privateKeyFile -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in $privateKeyFile -out $publicKeyFile
kubectl create secret generic auth-signing-key -n $targetNamespace --from-file=private="$privateKeyFile" --from-file=public="$publicKeyFile"
cd -
rm -r $tempDir

# Create tls key secret for ingress
kubectl create secret tls tls-secret --key ./config/ca/"$targetDomain".key --cert ./config/ca/"$targetDomain".crt -n $targetNamespace

# Do the helm install of the datalab chart
helm install "$helmDeploymentName" "$helmChartPath" \
  -n $targetNamespace \
  --set domain=$targetDomain,namespace=$targetNamespace,useAppArmor=false
