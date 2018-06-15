# Design

The architecture for the datalabs system is describes in the [Architecture Guide](../add/01-architecture-overview.md).

## Active Servers

The Datalabs system is comprised of a number of servers hosted on OpenStack managed
infrastructure in the JASMIN unmanaged cloud. The full list of running servers can be
viewed through the [Cloud Portal](https://cloud-beta.jasmin.ac.uk/).

To apply for a new account first
[create a new JASMIN account](https://accounts.jasmin.ac.uk/application/new/)
and then apply for access to the `nerc-datalab-u` through the
[Accounts Portal](https://accounts.jasmin.ac.uk/services/cloud_tenancies/).

The following servers are currently running. Given IP addresses are assigned at
startup and may change they are not listed.

| Name | Usage |
|------|-------|
|datalabs-bastion-1|External access point to all datalabs servers|
|datalabs-discourse|Production Discourse server|
|datalabs-discourse-test|Test Discourse server|
|datalabs-glusterfs-1|Gluster storage server|
|datalabs-glusterfs-2|Gluster storage server|
|datalabs-glusterfs-3|Gluster storage server|
|datalabs-glusterfs-4|Gluster storage server|
|datalabs-k8s-master-1|Kubernetes master node|
|datalabs-k8s-node-1|Kubernetes worker node 1|
|datalabs-k8s-node-2|Kubernetes worker node 1|
|datalabs-k8s-node-3|Kubernetes worker node 1|
|datalabs-load-balancer|Production load balancer|
|datalabs-terraform-state|Terraform state server|
|datalabs-test-load-balancer|Test load balancer|
|migration-data-store|Store of all datasets provided to datalabs project to allow Gluster cluster to be rebuilt.|

## DNS

External, "floating" IP addresses are attached to an instance and the allocation to
datalabs does remain static. The DNS names assigned to these IP addresses are

|DNS|Floating IP Address|
|*.datalabs.nerc.ac.uk|192.171.139.198|
|*.test-datalabs.nerc.ac.uk|192.171.139.197|
|bastion-datalabs.nerc.ac.uk|192.171.139.188|
|state-datalabs.nerc.ac.uk|192.171.139.187|

## Cluster Access

> Note Access to servers is restricted to known locations so it is necessary to either
be on one of the allowed locations or STFC VPN. The allowed locations are individual
white-listed IP addresses at RAL and the Tessella Abingdon office.

All SSH access to datalabs servers is via the Bastion server. This applies to both
public and private servers as this provides an easy way to control access. SSH via a
bastion server is easy to do on MacOS or Linux as SSH is a first class citizen.

The direct method is to first SSH onto the Bastion server forwarding SSH credentials
(`-A`) and then SSH on to the target machine.

```bash
ssh -A -i ~/.ssh/<ssh_private_key> deploy@<bastion_ip>
ssh deploy@<internal_server_ip>
```

A better way is to add SSH configuration to your SSH config file to allow single step
access. An example configuration for the same access is:

```bash
Host bastion
        # shuttle.name = Datalabs/Bastion
        HostName <bastion_public_ip>
        User deploy
        IdentityFile ~/.ssh/<private_key>
        ForwardAgent yes

Host k8s-master
        # shuttle.name = Datalabs/k8s-master
        HostName <internal_ip>
        User deploy
        ProxyCommand ssh bastion -W %h:%p
```

This then allows SSH access using a simple `ssh k8s-master`.

> **Note |** SSH on a Windows machine is a sorry story. MobaXterm provides a good
starting point but its support for SSH tunneling is limited. If you are supporting
Datalabs and trying to use Windows we strongly recommend that you stop and get a proper
operating system.

### SSH Tunnel to internal services running in private subnets

In order to access services running inside a private subnet it is necessary to set up an
SSH tunnel from a port on the local machine. There is an excellent paid tool for this on
MacOS called [Core Tunnel](https://coressh.io/).
This allows for easy configuration of tunnels and ensures that they stay open.

On Linux these are configured using the SSH config in the same way as the SSH connections
but to ensure that they stay open a utility called AutoSSH can be used. To configure the
tunnel add another block to the SSH config. An example for the Kubernetes API:

```bash
Host k8s-tunnel
  HostName <bastion_public_ip>
  User deploy
  ForwardAgent yes
  ControlPath=~/.ssh/ssh2k8s-%r@%h
  ControlMaster=auto
  IdentityFile ~/.ssh/<private_key>
  LocalForward 6443 <k8s_master_internal_ip>:6443
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

Then run `autossh` to open the tunnel. This will open the tunnel and ensure that it stays
open.

```
autossh -M 0 -f -T -N k8s-tunnel
```

This would then allow connections to the Kubernetes API running on a private internal
server to be accessed on `localhost:6443`.

## Kubernetes API Access

All access to Kubernetes, including using `kubectl` is through the API. This means that
in order to run Kubernetes commands from a local machine there must be an open SSH
tunnel. The instructions for configuring this are in the previous section.

To authenticate to the Kubernetes API it is necessary to have a config file correctly
configure with credentials and cluster configuration and the `KUBECONIG` environment
variable configured with the path to the config file.

```
export KUBECONFIG=/path/to/config
```

It is recommended that you are regularly going to work on datalabs that you spend the
time to configure your terminal to initialise an appropriate environment. It is also
recommended that you include a way to highlight which environment you are currently
configured for in the terminal. Some suggestions of configurations:

* [Prompt Config](https://github.com/jonmosco/kube-ps1)
* [Direnv](https://direnv.net/)

### Kube Config File, DNS & SSH Tunnel

The Kubeconfig file must be configured to reference the server on the same host name as
the Kubernetes master server (e.g. datalabs-k8s-master-1) as this name is inserted into
the autogenerated certificates that are provisioned as the cluster is created. It is not
possible to access the server at this name using public DNS as this is not a public
server and we instead need to access through the SSH tunnel as described above. To
achieve this an entry is needed in the `/etc/hosts` file to point the desired server name
to localhost and the config file should be updated to reference the server name and
tunneled IP address.

Example config file snippet:

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <cert-data>
    server: https://datalabs-k8s-master-1:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: <cert-data>
    client-key-data: <key-data>
```

With a hosts file entry of:

```
127.0.0.1       datalabs-k8s-master-1
```

This asusmes there is an open SSH tunnel running on port 6443 connected to the API
server on the Kubernetes master.

To verify configuration check the connection to the cluster run

```
kubectl version
```

The response should look something like below with both client and server versions. If
the server version is missing this means the connection is not correctly configured.

```
Client Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.2", GitCommit:"5fa2db2bd46ac79e5e00a4e6ed24191080aa463b", GitTreeState:"clean", BuildDate:"2018-01-18T21:11:08Z", GoVersion:"go1.9.2", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.7", GitCommit:"dd5e1a2978fd0b97d9b78e1564398aeea7e7fe92", GitTreeState:"clean", BuildDate:"2018-04-18T23:58:35Z", GoVersion:"go1.9.3", Compiler:"gc", Platform:"linux/amd64
```
