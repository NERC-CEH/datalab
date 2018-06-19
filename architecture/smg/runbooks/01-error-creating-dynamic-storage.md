# Error creating dynamic storage

Dynamic storage is created as Gluster volumes and all communication to Gluster from the
Kubernetes cluster is via the Heketi API. Due to a [bug](https://github.com/kubernetes/kubernetes/issues/42306) in Kubernetes storage classes DNS
does not resolve correctly so it is necessary to refer to the Heketi service by direct IP
address rather than through a service. This means that the connection is broken if the
pod is rescheduled and need to be recreated.

The error message seen in this scenario is something like

```bash
Warning  ProvisioningFailed  1m (x62 over 16m)  persistentvolume-controller  Failed to
provision volume with StorageClass "glusterfs-storage": create volume error: error
creating volume Post http://10.44.0.3:8080/volumes: dial tcp 10.44.0.3:8080: getsockopt:
no route to host
```

To resolve is is necessary to recreate the storage class. This can be done through an Ansible playbooks.

```bash
ansible-playbook heketi.yml --skip-tags=install
```

Check that the storage class now has the IP address for the Heketi pod

```bash
# List pods with IP addresses
kubectl get pods --all-namespaces -o wide

# Describe storage class
kubectl describe sc glusterfs-storage
```