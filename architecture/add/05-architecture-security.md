# Security View

This section details the Datalabs architecture from the view-point of its security.

* **[Cluster security](#cluster-security)**
* **[Server security](#server-security)**
* **[Authentication and Authorization](#authentication-and-authorization)**

* **[Trust zones](#trust-zones)**
* **[Single Sign On](#single-sign-on)**
* **[Data security](#data-security)**
* **[Secret management](#secret-management)**
* **[Claims representation](#claims-representation)**
* **[Command security](#command-security)**

## Cluster Security

The Datalabs system is hosted in a [JASMIN](https://help.ceda.ac.uk/collection/59-jasmin-documentation)
unmanaged cloud tenancy. This means that we are provided with an isolated 192.168.3.0/24
network space providing 256 IP addresses. There are also three public IP addresses that
can be allocated within the tenancy allowing traffic from the public Internet to reach
our servers.

The cluster is separated into two logical subnets, a public subnet that is accessible
from the public Internet and a private subnet that is not accessible from the public
Internet. There are actually three servers in the public subnet as there are two load
balancers, one for test and one for production traffic.

The diagram below shows this configuration and the allowed network
communication between nodes. This is discussed further below.

![Cluster Security](./diagrams/cluster-security.png)

### Public Subnet

The public subnet contains two logical servers per instance of Datalabs. These are both
given external IP addresses and connected to NAT instances through the Ansible vCloud
provisioning.

* **Load Balancer** - The Ubuntu load balancer server receives all inbound user traffic
on ports 80 (HTTP) and 443 (HTTPS). Traffic is then streamed using the [Nginx stream](https://docs.nginx.com/nginx/admin-guide/load-balancer/tcp-udp-load-balancer/)
module and load balanced across all the Ingress service on all Kubernetes worker nodes.
* **SSH Bastion** - The Bastion server is a simple Ubuntu server is configured with a
public IP address and accessible via the public Internet. The firewall is restricted to
allow incoming traffic on only port 22 for SSH from a small number of locations. This
list is currently only ICE and MIST (Linux Desktops at RAL) and Tessella's public IP
address for both Internal and VPN networks. The list is defined in the Ansible bastion
`group_vars` and would require rerunning the provisioning to alter the list. It must not
be altered manually as a bastion rebuild would reset the values. If a

### Private Subnet

The private subnet contains all of the remaining Datalabs servers that comprise the
Kubernetes and GlusterFS clusters. The firewalls for these machines are configured to
accept inbound traffic on ports 80 and 443 from the public servers and on port 22 from
the bastion server.

#### Access to servers in private subnet

In order to access servers in the private subnet it is necessary to jump through the
bastion server. This is easy to do on MacOS or Linux as SSH is a first class citizen.

The direct method is to first SSH onto the Bastion server forwarding SSH credentials
(`-A`) and then SSH on to the target machine.

```bash
ssh -A -i ~/.ssh/<ssh_private_key> deploy@<bastion_ip>
ssh deploy@<internal_server_ip>
```

A better way is to add SSH configuration to you SSH config file to allow single step
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

#### SSH Tunnel to internal services running in private subnets

In order to access services running inside a private subnet it is necessary to set up an
SSH tunnel from a port on the local machine. There is an excellent paid tool for this on
MacOS called [SSH Tunnel](https://itunes.apple.com/gb/app/ssh-tunnel/id734418810?mt=12).
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

## Server Security

In addition to the network configuration described above, all servers are provisioned
using a base security configuration that does the following:

* **Reconfigures root user** - Updates the root password, disables password
authentication, disables root SSH access and optionally changes the SSH port (unused).
* **Adds deploy user** - This user is common across all machines and is the account that
the Ansible provisioning uses. This user can access using SSH from allowed locations and
is added to the sudoers list.
* **Updates Hosts file** - Add all servers in cluster along with their names to allow
DNS lookups to function correctly.
* **Configure Firewall for SSH** - Update the Ubuntu Uncomplicated Firewall (ufw) to
allow SSH access from all management IP addresses.
* **Configure APT auto updates** - Ensure that security patches are applied to the
servers.
* **Configure email summaries** - Configure email summaries to be sent by logwatch. NOTE:
The email configuration on this isn't currently working and was left as the move to
OpenStack may resolve this.

## Authentication and Authorisation

The Datalabs system has a complicated authentication and authorisation story due to the
number of different components and different types of access. This section covers the
following topics:

* **Authentication using Auth0**
* **Authorisation tokens**
* **Authorisation Service**
* **Ingress Authorisation**
* **Single Sign On**

### Authentication using Auth0

We have selected to use [Auth0](https://auth0.com/) to provide authentication as a
service. As OSS we are provided with the full Auth0 service free or charge and this has
provided us an alternative to implementing user management and authentication. It also
offers powerful capabilities for integrating with third party Identity Providers (IdP)
which would provide an easy option to integrate with our users existing systems.

Auth0 provides many different capabilities but we are using only a small number in the Datalabs system:

* **Clients** - an Auth0 client defines a client that will use Auth0 to authenticate a user.
* **APIs** - an API can be consumed from a client with Auth0 managing the authentication
flow.
* **Connections** - Connections represent an IdP. We are currently making use of the
Auth0 provided database but intend to extend this to include other types of connections
if needed by our target organisations.
* **Extensions** - Auth0 provides an extension mechanism and a library of existing
extensions. We are using the [Auth0 Authorisation](https://auth0.com/docs/extensions/authorization-extension/v2)
extension to provide an easy way to define roles and assign them to users.

#### Clients

Datalabs has a number of Auth0 clients for different components:

* **datalab-app** - The main Datalabs web application client. Used by the application to
authenticate the user and retrieve the `authorization_token` and `id_token`.
* **Datalab Authorisation API** - Client for accessing the Authorisation extension. Used
by the Authorisation service to retrieve user role information
* **Discourse** - Client for Discourse instances. Allows users to authenticate against
Discourse using the same credentials.
* **auth0-authz** - Create and used by the Authorisation extension. Not consumed directly
by datalabs.
* **API Explorer Client** - Not needed by the application, created to allow admin access
to the Auth0 API. This has only been used once, to set an inaccessible flag on the
`datalab-api` for `is_first_party: true` to stop it showing the consent dialog to new
users.

From the Auth0 dashboard it is possible to retrieve (or change) the Client ID, Client
secret, Allowed Callback URLs, Allowed Logout URLs. The test and production Datalabs
instances currently both share the same client but in the longer term this should be
chanaged.

#### APIs

Datalabs has three APIs defined in Auth0:

* **datalab-api** - The API resource representing the GraphQL aggregation API. Auth0
provides a [tutorial](https://auth0.com/docs/quickstart/spa/react/03-calling-an-api) on
how to configure and consume this.
* **auth0-authorization-extension-api** - Created and used by the Authorisation
extension.
* **Auth0 Management API** - Not needed by the application, created to allow admin access
to the Auth0 API.

#### Connections

Datalabs has a single Database Connection called `Datalabs`. This provides a simple
database of users who can access the application. User sign up has been turned off so
new Datalabs users can only be added by an Auth0 admin.

#### Extensions

Datalabs makes use of the Auth0 Authorisation Extension to provide an easy way to define
roles and assign them to users. These are in turn used to map to permissions within the
scope of the authorisation service and the process for this is defined below in
[#authorisation-service]


##Authorisation tokens##
##Authorisation Service##
##Ingress Authorisation##
##Single Sign On##














