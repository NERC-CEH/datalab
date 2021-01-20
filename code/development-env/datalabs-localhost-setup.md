# `datalabs.localhost` Setup

## Enable ingress

For ingress into the cluster to work, you need to enable the minikube ingress addon.

```bash
minikube addons enable ingress
```

## Add website tls x509 certificate as Kubernetes secret

This secret must be created __before__ adding ingress rules.

```bash
kubectl create secret tls tls-secret --key ./config/ca/datalab.localhost.key --cert ./config/ca/datalab.localhost.crt -n devtest
```

## Create ingress rules to point back to host machine

We can add ingress rules to use a loopback ip address to access element on the
host machine. These rules use self-signed TLS certificates, these must be
generated and stored as Kubernetes secrets __before__ creating the ingress
rules. When running minikube in VirtualBox this address is expected to be
`10.0.2.2` (this is the gateway address given to minikube by VirtualBox, i.e. from
a container running within minikube, the host machine (i.e. localhost) can be accessed
at `10.0.2.2`).

```bash
kubectl apply -f ./config/manifests/minikube-proxy.yml
```
