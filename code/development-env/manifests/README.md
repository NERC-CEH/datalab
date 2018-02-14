# Localhost ingress routes

- Update `externalName` to match machines network address
- Update `namespace` to match a minikube namespace

```bash
kubectl apply -f local-ingress-rules.yml
```

# Create minikube storage class

```bash
kubectl apply -f storage-class.yml
```

# Add custome route for service

- Create ingress route using `example-cluster-local-ingress.yml` as a template
- Update `host` to match service name and namespace
- Update `namespace` to match a minikube namespace
- Apply configure
