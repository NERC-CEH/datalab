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

# Names to be used for the secrets
mongoSecretName="mongo-password-secret"
authSigningKeySecretName="auth-signing-key"
tlsSecretName="tls-secret"

# Temporary directory that will be used to generate the auth signing certificates.
# This directory is created and deleted within this script.
tempDir='./tmp'

# create mongo password secret, deleting if already exists
if kubectl get secret $mongoSecretName &> /dev/null; then  # &> /dev/null suppresses command output
  echo "$mongoSecretName already exists. Recreating."
  kubectl delete secret $mongoSecretName
fi
kubectl create secret generic $mongoSecretName \
  -n $targetNamespace \
  --from-literal secret="$mongoPassword"
echo "---"

# Create auth-signing-key secret
privateKeyFile=private_key.pem
publicKeyFile=public_key.pem
mkdir $tempDir
cd $tempDir
openssl genpkey -algorithm RSA -out $privateKeyFile -pkeyopt rsa_keygen_bits:2048 &> /dev/null
openssl rsa -pubout -in $privateKeyFile -out $publicKeyFile &> /dev/null

if kubectl get secret $authSigningKeySecretName &> /dev/null; then
  echo "$authSigningKeySecretName already exists. Recreating."
  kubectl delete secret $authSigningKeySecretName
fi
kubectl create secret generic $authSigningKeySecretName \
  -n $targetNamespace \
  --from-file=private="$privateKeyFile" \
  --from-file=public="$publicKeyFile"

cd - > /dev/null
rm -r $tempDir
echo "---"

# Create tls key secret for ingress
if kubectl get secret $tlsSecretName &> /dev/null; then
  echo "$tlsSecretName already exists. Recreating."
  kubectl delete secret $tlsSecretName
fi
kubectl create secret tls $tlsSecretName \
  --key ./config/ca/"$targetDomain".key \
  --cert ./config/ca/"$targetDomain".crt \
  -n $targetNamespace
echo "---"

# Do the helm install of the datalab chart
helm install "$helmDeploymentName" "$helmChartPath" \
  -n $targetNamespace \
  --set domain=$targetDomain,namespace=$targetNamespace,useAppArmor=false
