# Minikube Kubernetes manifests

## Create `devtest` namespace

```bash
kubectl apply -f minikube-namespace.yml
kubectl config set-context minikube --namespace=devtest
```

## Create storage class

```bash
minikube addons enable storage-provisioner
kubectl apply -f minikube-strage.yml
```

## Create ingress rules to point back to host machine

We can add ingress rules to use a loopback ip address to access element on the
host machine. These rules use self-signed TLS certificates, these must be
generated and stored as Kubenetes secrests __before__ creating the ingress rules
([see instructions](../config/ca/README.md)). When running minikube in
VirtualBox this address is expected to be `10.0.2.2` (this is the gateway
address given to minikube by VirtualBox).

```bash
kubectl apply -f minikube-proxy.yml
```
