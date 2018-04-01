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

### Initialise Terraform

To initialise Terraform execute `terraform init`. This will download the required modules
and prepare initial state. If trying to work against an inital set of servers then the
`.tfstate` files will be required but there is no mechanism in place for sharing these
at the current time.

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

The bootstrap process performs two operations:

* Install Python 2.7 onto each box allowing Ansible to function corrrectly
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

* Script the configuration of the bastion `/etc/hosts` file.
* Improve the dynamic inventory to handle both public and private servers removing the
need to tweak the hosts file.
* Use a remote store for `.tfstate` files to allow multiple users to work on this.
* Script the process to remove the need to run multiple commands.

## Note on Dynamic Inventory

There are two dynamic inventory scripts in this repository, one queries `.tfstate` files
and the other queries OpenStack directly. The OpenStack inventory is more useful but is
not as complete as the Terraform option so the two are used in combination. The Terraform
inventory is used initially for the creation of the `/etc/hosts` entry and then the
OpenStack inventory is used after this as it can be used in isolation from the Terraform
state, making its use more flexible.

