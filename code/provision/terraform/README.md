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


