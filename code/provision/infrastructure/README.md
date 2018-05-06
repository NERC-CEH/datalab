# Provisioning Servers using OpenStack and Terraform

## Access to OpenStack

Access to the OpenStack API is controlled by an IP address white list. The list of IP
addresses are:

* Tessella Internal
* Tessella DMZ
* Ice (Gary's RAL Desktop)
* Mist (Josh's RAL Desktop)

## Install OpenStack CLI

On Linux `pip install python-openstackclient`

## Create OpenStack RC file

For the CLI to work you need to make your credentials available as environment variables.
The easiest way to do this is to create a file that exports them and `source` it into the
console before running OpenStack CLI commands.

```
export OS_AUTH_URL=https://kataifi.sweet.jasmin.ac.uk
export OS_IDENTITY_API_VERSION=3
export OS_USER_DOMAIN_NAME=jasmin
export OS_PROJECT_DOMAIN_NAME=jasmin
export OS_PROJECT_NAME=nerc-datalab-U
export OS_USERNAME=<llogr>
export OS_PASSWORD=<password>
```

An easy way to manage this config is to use [Direnv](https://direnv.net/) and then switch
into a directory that contains a `.envrc` file with the content above when you want to
use the CLI.

## Configure OpenStack credentials for Terraform

Copy `clouds.yaml.example` to `~/.config/openstack/clouds.yaml` and update with the
appropriate `username` and `password`. Putting passwords in plain text isn't ideal, but
it is the recommended OpenStack way for supplying these credentials.

## Server Creation

This sections describes the steps required to build a new set of severs and perform
base provisioning to a level that can then be managed by the core ansible scripts.

This process could be more streamlined and automated but sufficient time was not
available for this. Possible improvements are highlighted below.

### Initialise Environment

Start the Vagrant box using `vagrant up`.

Ensure that the `clouds.yaml` and `openrc` files exist and have been correctly mounted
into the Vagrant machine.

Source the `openrc` file with `source ~/.config/openstack/openrc`.

### Clear Known Hosts

To ensure old server identities don't cause SSH issues delete the known hosts file:

```
rm ~/.ssh/known_hosts
```

### Provision Terraform State server

If not already provisioned then a Terraform state management server must be created using Ansible scripts. The scripts
are across both the `infrastructure` and `playbooks` directories to allow role reuse. A code restructure could remove
this requirement but two playbooks are still required as dynamic inventory is used and cannot identify the server until
it has been created.

Execute the following three commands to create a Terraform State server:

```bash
# In ./infrastructure
ansible-playbook terraform-state-server.yml

# Restart the server if the disk isn't correctly mounted
ansible-playbook terraform-state-server-provision.yml

# In ./playbooks
ansible-playbook terraform-state-server.yml
```

This should complete with no errors. Do not proceed if there are.

### Initialise Terraform

To initialise Terraform execute the `terraform init` command below replacing the `ip address`, `uername` and `password`
for the correct values . This will download the required modules and prepare initial state.

```bash
terraform init \
    -backend-config="address=http://<ip_address>/state/datalabs" \
    -backend-config="lock_address=http://<ip_address>/state/datalabs" \
    -backend-config="unlock_address=http://<ip_address>/state/datalabs" \
    -backend-config="username=username" \
    -backend-config="password=password"
```

### Plan & Execute

Execute `terraform plan` to see what changes Terraform will make to the resources if the
plan is executed.

Execute `terraform apply` to run the plan.

### Configure Bastion /etc/hosts

Due to the way the `openstack.py` inventory script works it is necessary to address all
servers by name and only public facing servers get an IP address. This means that for the
bastion to operate correctly it must resolve the IP address from the name and this can be
achieved by editing the `/etc/hosts` file.

* Build the entry for /etc/hosts using the Terraform dynamic inventory script. Execute
`./inventory/terraform.py --hostfile` and copy the resulting `hosts` file snippet
* SSH on to the bastion server. `ssh -i <key> ubuntu@ipaddress`.
* Edit the `/etc/hosts` file and add the generated hosts block.

### Check connection to servers

At this point, the routing to the servers should be correctly configured for Ansible to
work against them. However, the base server image does not have Python 2.7 installed and
this is a pre-requisite for most Ansible modules so we expect to see failures. Execute
`ansible -m ping all -u ubuntu`. All servers other than the bastion should fail with the
error `/bin/sh: 1: /usr/bin/python: not found\r\n`. Now we are ready to bootstrap the
servers.

### Bootstrap

The bootstrap process performs several operations:

* Configure the `/etc/hosts` file for the bastion server to allow all private hosts to be
addressed by name.
* Install Python 2.7 onto each box allowing Ansible to function corrrectly.
* Configure the `/etc/hosts` file for all private servers.
* Extend the drive to make use of all attached storage as the initial volumes are too
small for use as Kubernetes nodes.

To execute the bootstrap process run:

```
ansible-playbook bootstrap.yml
```

> Note: The `ansible.cfg` file provides the `inventory/openstack.py` dynamic inventory to
allow the servers to be discovered by the OpenStack API.

### Confirm server configuration

Execute the Ansible ping again and this time expect a successful response from all
servers:

```ansible -m ping all -u ubuntu```

### Improvements

* Use a remote store for `.tfstate` files to allow multiple users to work on this.
* Script the process to remove the need to run multiple commands.
* Improve the dynamic inventory to handle both public and private servers removing the
need to tweak the hosts file - probably not needed as hosts files suffice.

## Note on Dynamic Inventory

There are two dynamic inventory scripts in this repository, one queries `.tfstate` files
and the other queries OpenStack directly. The OpenStack inventory is more useful but is
not as complete as the Terraform option so the two are used in combination. The Terraform
inventory is used initially for the creation of the `/etc/hosts` entry and then the
OpenStack inventory is used after this as it can be used in isolation from the Terraform
state, making its use more flexible.

## Provision Datalabs

This section of the document describes the steps taken to provision a new Datalabs environment from scratch.

### Before you start

Ensure that you have:

* An OpenStack tenancy and have configured API access from your current location as described above
* Spare capacity in your tenancy
* Cleared your `known_hosts` entries if you are rebuilding existing servers

### Provisioning

Start a Provisioning environment

```bash
cd code/provision
vagrant up
vagrant ssh
```

Create the infrastructure. In the `~/infrastructure` directory:

```bash
terraform plan
terraform apply
```

Bootstrap the servers to a common base. In the `~/infrastructure` directory

```bash
ansible-playbook bootstrap.yml
```

Create Load balancer servers. In the `~/playbooks` directory

```bash
ansible-playbook load-balancer.yml
```

Provision the GlusterFS Servers. In the `~/playbooks` directory

```bash
ansible-playbook gluster.yml

```

Provision the Kubernetes Cluster. In the `~/playbooks` directory

```bash
ansible-playbook kubernetes-cluster.yml
```

Provision Heketi Gluster Manager. In the `~/playbooks` directory

```bash
ansible-playbook heketi.yml
```

Provision Kubernetes Tools. In the `~/playbooks` directory

```bash
ansible-playbook kubernetes-tools.yml
```

Provision Discourse Servers. In the `~/playbooks` directory

```bash
ansible-playbook discourse-server.yml
```

### 

To provision Gluster servers run the GlusterFS playbook

```bash

```
### Load Balancers

### Kubernetes

