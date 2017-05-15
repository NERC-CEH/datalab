# Kubernetes Cluster

A Kubernetes cluster can be provisioned with the ```kubernetes-cluster.yml``` ansible script.

The script is intended to operate on nodes that have already been provisioned and secured. It builds first the master and then the worker nodes.

The plays are tagged with ```master``` and ```workers``` to allow parts of the playbook to be run indepentently.

To execute the playbook run one of the following:

```
ansible-playbook kubernetes-cluster.yml
ansible-playbook --tags=master kubernetes-cluster.yml
ansible-playbook --tags=workers kubernetes-cluster.yml
```

## Kubectl

Kubernetes cluster management is done with the ```kubectl``` tool. This is installed by default on all nodes but only configured to ru on the master. In order for it to pick up the config file it is necessary to set an environment variable.

```
export KUBECONFIG=$HOME/admin.conf
kubectl get nodes
```

## Locel Kubectl

By design, the Kubernetes cluster is protected behind a bastion server. This means that an SSH tunnel is required to allow a local instance of kubectl to connect to the server.

### Configure SSH

Edit your ```~/.ssh/config``` file to define the bastion server and a tunnel configuration. For example:

```
Host bastion
  HostName <bastion_public_ip>
  User deploy
  ForwardAgent yes
  IdentityFile <path_to_key>

Host k8s-master
  HostName <k8s_master_internal_ip>
  User deploy
  ProxyCommand ssh bastion -W %h:%p

Host k8s-tunnel
  HostName <bastion_public_ip>
  User deploy
  ForwardAgent yes
  ControlPath=~/.ssh/ssh2k8s-%r@%h
  ControlMaster=auto
  IdentityFile ~/.ssh/id_rsa_jasmin
  LocalForward 6443 <k8s_master_internal_ip>:6443
```

Then, to open the tunnel simply run

```
ssh -f -N k8s-tunnel
```

### Configure kubectl

The Kubernetes master has a kubectl configuration file that must be copied locally in order to run. The easiest way to get this is to run:

```
scp k8s-master:~/admin.conf .
```

### Test the connection

With the tunnel open execute

```
export KUBECONFIG=<path_to_config>/admin.conf
kubectl get nodes
```

If the nodes are listed then the tool is configured correctly.

### Close the SSH tunnel

Details about the tunnel are stored at the control path specified in the configuration. This allows the tunnel to be stopped with:

```
ssh -O stop -S ~/.ssh/ssh2k8s-deploy@192.171.139.117 k8s-tunnel
```
