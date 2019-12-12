# Provisioning Datalabs using OpenStack and Terraform

This section of the document describes the steps taken to provision a new Datalabs
environment from scratch.

## Before you start

Ensure that you have:

* An OpenStack tenancy with spare capacity
* Cleared your `known_hosts` entries if you are rebuilding existing servers

## Configure Access to OpenStack

Access to the OpenStack API is controlled by an IP address white list. The list of IP
addresses are:

* Tessella Internal
* Tessella DMZ
* Ice (Gary's RAL Desktop)
* Mist (Josh's RAL Desktop)
* RAL VPN

### Install OpenStack CLI

On Linux `pip install python-openstackclient`.

> Note that provisioning VM already has the openstack client installed.

### Create OpenStack RC file

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

Copy `clouds.yaml.example` to `~/.config/openstack/clouds.yaml` on your host machine and
update with the appropriate `username` and `password`. Putting passwords in plain text
isn't ideal, but it is the recommended OpenStack way for supplying these credentials.

## Server Creation

This sections describes the steps required to build a new set of severs and perform
base provisioning to a level that can then be managed by the core ansible scripts.

This process could be more streamlined and automated but sufficient time was not
available for this. Possible improvements are highlighted below.

### Create or select base image

The JASMIN Openstack environment provides a number of different server base images.
These can be viewed either through the portal or using the CLI through
`openstack image list`. These images are updated regularly and old images are retired.
This can cause a problem with Terraform as once the base image has been removed
Terraform is no longer able to recognise the resources that it provisioned. To avoid
this we create a datalabs specific base image which we can independently manage the
lifecycle for.

#### To create a new base image:

Create a new server using the Portal. **Set the name of the server to the desired image
name** as it cannot be set later in the process. Select the smallest image size
otherwise when used servers will not be able to be created using
smaller image sizes. By convention images are named
`<os-version>-datalabs-<date-of-base-image>`. For example, if the base is
`ubuntu-1804-20190104` the image created should be `ubuntu-1804-datalabs-20190104`.

Once the machine has started run `openstack server image create <server-name>`.

Verify the image has been created and is `active` using the command
`openstack image list`.

### Review Site specific configuration

As far as possible, site specific configuration has been extracted to a small collection
of files. Before provisioning a new environment, these should be reviewed and updated as
required.

* `infrastructure/sites/<site>.tfvars` - Details of OpenStack environment and floating IP addresses
* `playbooks/group_vars/tessella` - All site specific variables for Datalabs stack including encrypted secrets

### Initialise Environment

A provisioning environment requires a number of dependencies and is complicated to
configure. To provide ease and consistency for all developers a Vagrant box has been
defined for provisioning. Start the Vagrant box using:

```bash
cd code/provision
vagrant up
vagrant ssh
```

Ensure that the `clouds.yaml` and `openrc` files exist and have been correctly mounted
into the Vagrant machine.

Source the `openrc` file with `source ~/.config/openstack/openrc`.

### Clear Known Hosts

To ensure old server identities don't cause SSH issues delete the known hosts file:

```bash
rm ~/.ssh/known_hosts
```

### Provision Terraform State server

If not already provisioned then a Terraform state management server must be created
using Ansible scripts. The scripts are across both the `infrastructure` and `playbooks`
directories to allow role reuse. A code restructure could remove this requirement but
two playbooks are still required as dynamic inventory is used and cannot identify the
server until it has been created.

Execute the following three commands to create a Terraform State server:

```bash
# Create the terraform server using Ansible. In playbook directory:
# Additional configuration is required to target the site. Later Ansible executions pick this up through server tags
ansible-playbook terraform-state-server-create.yml \
    --extra-vars "@group_vars/<site>/all-vars.yml" \
    --extra-vars "@group_vars/<site>/all-vault.yml"
ansible-playbook terraform-state-server.yml --extra-vars "@group_vars/<site-dir>/all.yml"

# Perform basic provisioning. In playbooks directory:
ansible-playbook terraform-state-server-provision.yml

# Provision Terraform state server role. In playbooks directory:
ansible-playbook terraform-state-server.yml
```

This should complete with no errors. Do not proceed if there are any.

### Initialise Terraform

To initialise Terraform, in the `infrastructure` directory execute the `terraform init`
command below replacing the `domain-name`, `uername` and `password` for the correct
values. This will download the required modules and prepare initial state.

```bash
terraform init \
    -backend-config="address=http://<domain-name>/state/datalabs" \
    -backend-config="lock_address=http://<domain-name>/state/datalabs" \
    -backend-config="unlock_address=http://<domain-name>/state/datalabs" \
    -backend-config="username=<username>" \
    -backend-config="password=<password>" \
    -var-file="sites/<site>>.tfvars"

# For example
terraform init \
    -backend-config="address=http://state-datalabs.nerc.ac.uk/state/datalabs" \
    -backend-config="lock_address=http://state-datalabs.nerc.ac.uk/state/datalabs" \
    -backend-config="unlock_address=http://state-datalabs.nerc.ac.uk/state/datalabs" \
    -backend-config="username=username" \
    -backend-config="password=password" \
    -var-file="sites/tessella.tfvars"
```

### Plan & Execute

Execute `terraform plan -var-file="sites/tessella.tfvars"` to see what changes Terraform
will make to the resources if the plan is executed.

Execute `terraform apply -var-file="sites/tessella.tfvars"` to run the plan.

### Bootstrap

The bootstrap process performs several operations:

* Configure the `/etc/hosts` file for the bastion server to allow all private hosts to be
addressed by name.
* Install Python 2.7 onto each box allowing Ansible to function correctly.
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

In the `~/playbooks/` directory, execute the Ansible ping again and this time 
expect a successful response from all servers:

```ansible -m ping all -u ubuntu```

### Execute the Datalabs Playbook

Execute the full suite of Datalabs playbooks. In the `~/playbooks` directory

```bash
ansible-playbook datalabs.yml
```

This playbook combines playbooks that do the following:

* Configure Load Balancers
* Configure Gluster Servers
* Configure Kubernetes Cluster
* Configure Heketi as dynamic Gluster provisioner
* Install Kubernetes Tools (Monitoring and Logging)

### Improvements

* Script the process to remove the need to run multiple commands.

## Note on Dynamic Inventory

Dynamic inventory is provided through Ansible and queries against the OpenStack API to
build inventory from available servers. More information can be found in the
[Ansible documentation](https://docs.ansible.com/ansible/latest/user_guide/intro_dynamic_inventory.html#inventory-script-example-openstack).

## Configuring SSH tunnel for provisioning through desktop bastion

The cluster bastion only accepts incoming requests from office locations which makes it
impossible to provision through the bastion directly while working at a remote location.

This can be addressed through careful SSH tunnelling and an adjustment to the
`proxied/vars.yml` to match the configuration.

A setup that has worked is as follows:

* Connect to the STFC VPN to give network access to a desktop machine allowed to
provision (Ice of Mist)
* Create an SSH tunnel to the machine passing a local port to the SSH port on the desktop
For example (localhost:3222 -> desktop:22)
* Reconfigure the proxy SSH configuration to use the tunnel.

```
ansible_ssh_common_args: '-o ForwardAgent=yes -o ProxyCommand="ssh -p 3222 -W %h:%p -q {{ deploy_user }}@10.0.2.2"'
```

Note the IP address `10.0.2.2` is the *HOST IP* for the Vagrant VM that Ansible
provisioning is executed from (as localhost is the guest and will not reach the tunnel).

Test the connection with the following command from the VM.

```
ansible -i inventory.yml k8s-master -m ping -u deploy
```
