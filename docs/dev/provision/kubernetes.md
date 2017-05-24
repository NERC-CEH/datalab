# Kubernetes Cluster

A Kubernetes cluster can be provisioned with the ```kubernetes-cluster.yml``` ansible
script.

The script is intended to operate on nodes that have already been provisioned and
secured. It builds first the master and then the worker nodes.

The plays are tagged with ```master``` and ```workers``` to allow parts of the playbook
to be run indepentently.

To execute the playbook run one of the following:

```bash
ansible-playbook kubernetes-cluster.yml
ansible-playbook --tags=master kubernetes-cluster.yml
ansible-playbook --tags=workers kubernetes-cluster.yml
```

## Kubectl

Kubernetes cluster management is done with the ```kubectl``` tool. This is installed by
default on all nodes but only configured to run on the master. In order for it to pick up
the config file it is necessary to set an environment variable.

```bash
export KUBECONFIG=$HOME/admin.conf
kubectl get nodes
```

## Local Kubectl

By design, the Kubernetes cluster is protected behind a bastion server. This means that
an SSH tunnel is required to allow a local instance of kubectl to connect to the server.

### Install Kubectl

Installation instructions are [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
Be sure to install the correct version to match the cluster.

#### Centos

It should be possible to install the binary directly from the instructions above, but on
Centos this method was used.

```bash
sudo su
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
exit

sudo yum install -y kubectl
```

#### MacOs

Install using Homebrew

```bash
brew install kubectl-cli
```

### Configure SSH

Edit your ```~/.ssh/config``` file to define the bastion server and a tunnel
configuration. For example:

```bash
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
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

Then, to open the tunnel simply run

```bash
ssh -f -N k8s-tunnel
```

The tunnel can often die if running like this and has to be killed and restarted. An
easier option is to use [autossh](https://www.everythingcli.org/ssh-tunnelling-for-fun-and-profit-autossh/). First install autossh

```bash
sudo yum install autossh
```

Then to start tunnel run:

```bash
autossh -M 0 -f -T -N k8s-tunnel
```

### Configure kubectl

The Kubernetes master has a kubectl configuration file that must be copied locally in
order to run. The easiest way to get this is to run:

```bash
scp k8s-master:~/admin.conf .
```

The config file has a reference to the kubernetes master in the clusters.cluster.server
property. This must be a name that matches the auto generated SSL certificates on the
master and cannot be localhost or an IP address. Given there is no DNS entry for the
server and we are using an SSH tunnel, it is necessary to map localhost to a vaild name
for the server. One option is to use the server name `k8s-master`. Edit
`/etc/hosts` to add an entry of:

```bash
127.0.0.1 k8s-master
```

### Test the connection

With the tunnel open execute

```bash
export KUBECONFIG=<path_to_config>/admin.conf
kubectl get nodes
```

If the nodes are listed then the tool is configured correctly.

```bash
NAME           STATUS    AGE       VERSION
k8s-master     Ready     21h       v1.6.3
k8s-worker-1   Ready     19h       v1.6.3
k8s-worker-2   Ready     19h       v1.6.3
```

### Close the SSH tunnel

Details about the tunnel are stored at the control path specified in the configuration.
This allows the tunnel to be stopped with:

```bash
ssh -O stop -S ~/.ssh/ssh2k8s-deploy@192.171.139.117 k8s-tunnel
```
