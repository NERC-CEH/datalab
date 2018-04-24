# Prometheus Ansible Role

This role installs Prometheus via a helm chart and backed with Gluster dynamic storage.

## Deletion

Deletion of the Helm chart may not be clean if the resources failed to initialise. The following commands have been
needed to clear down the helm deployment and namespace to allow a clean installation.

```$bash
# Delete and purge Helm deployment
helm delete prometheus --purge --tls

# Check Helm deployments
helm ls --tls -a

# List pods in namespace
kubectl get po -n prometheus

# Force delete pod
kubectl delete pod <pod-name>  -n prometheus --grace-period=0 --force

# Delete Namespace
kubectl delete ns prometheus

# Check Namespaces
kubectl get ns
``` 