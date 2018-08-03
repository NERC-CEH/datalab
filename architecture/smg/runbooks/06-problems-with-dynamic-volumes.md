# Problems with dynamic volumes

The dynamic volume creation mechanism in Datalabs is complex and has a number of moving
pieces to make them work. This runbook describes the common problems and how to resolve
them.

The symptom of issues in this area will usually be broken volumes in datalabs that are
showing as `PENDING` in the k8s cluster when listed.

```
kubectl get pvc --all-namespaces
```

## Heketi pod has rescheduled breaking the glusterfs storage class

There is a bug in Kubernetes DNS for storage classes which means that the Heketi volume
management service cannot be referenced via a Kubernetes service and instead only by IP
address. This means that when the Heketi pod gets rescheduled for any reason it gets a
new IP address and breaks the storage class.

To diagnose whether this is the issue get the IP address of the Heketi pod and check the
description of the storage class.

```
# List default namespace pods with IP addresses (Heketi is installed in default)
kubectl get po -o wide -n default

# Describe storage class
kubectl describe sc glusterfs-storage
```

The resturl in parameters should point to the pod. If it doesn't then the storage class
must be recreated using part of the Heketi playbook.

```
ansible-playbook heketi.yml --skip-tags=install
```

## SSH communication between Heketi and Gluster servers is broken

To orchestrate Gluster, the Heketi pod requires password less SSH connectivity to the
Gluster nodes. This is configured in the main Gluster playbook where an SSH key pair is
generated with the public keys put into the Gluster nodes `authorized_keys` file and the
private key on the k8s master. The `gk-deploy` process then copies the key into a k8s
secret which can then be mounted into the Heketi container under `/etc/heketi`.

Errors in this SSH connection present as an error event for the unbound PVC

```
kubectl describe pvc -n <namespace> <pvc-name>
```

The error may be something like `kubernetes create volume error: error creating volume dial tcp 192.168.3.101:22: getsockopt: connection timed out`.

The first thing to check is that it is possible to SSH from the k8s nodes to the gluster
nodes. To do this, copy the SSH private key from the k8s master at `~/.ssh/heketi_id_rsa`
to a k8s node and then try to connect:

```
ssh -i <path_to_private_key> heketi@<glusternode>
```

If this fails then it is likely to be the firewall on the Gluster Nodes. SSH to the
Gluster node and check the firewall configuration:

```
sudo ufw status
```

If the firewall doesn't explicitly allow port 22 from the k8s nodes then this can be
resolved by running the `ensure-gluster-firewall.yml` playbook.

```
ansible-playbook ensure-gluster-firewall.yml
```

## Additional debugging

It is possible to call the Heketi API by connecting to Heketi pod and using the Heketi
CLI.

```
kubectl exec -n default -it <heketi-pod> bash

# Check Heketi query is working
heketi-cli -s http://localhost:8080 --user admin --secret 'secret_key' volume list

# Check if volume can be created
heketi-cli -s http://localhost:8080 --user admin --secret 'secret_key' volume create --size=5 --name=test
```

If the query is working but a volume can't be created then this points to SSH connection
issues as described above. This can additionally be tested from within the container by
first installing SSH `yum install ssh*` and then trying to connect

```
# Note DNS for node won't resolve here so must use IP
ssh -i /etc/heketi/private_key heketi@<gluster-node-ip>
```
