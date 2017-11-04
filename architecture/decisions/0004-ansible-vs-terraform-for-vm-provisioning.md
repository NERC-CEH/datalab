# 4. Ansible vs Terraform for automated VM provisioning

Date: 2017-11-04

## Status

Accepted

## Context

The JASMIN cloud portal and vCloud director portals give manual options for provisioning
servers into the JASMIN tennancy. This brings significant effort to rebuild a cluster
as all servers would need to be manually deleted and recreated. The new OpenStack
infrastructure is supposed to be available in a matter of months and we need to decide
whether we want to invest effort in automating server creation.

If we do decide to automate we need to decide which technology to use between Ansible
and Terraform. Terraform is known to work with vCloud director but it would be preferable
to use the same tool for server creation as software provisioning.

## Decision

We have decided to use Ansible as our server provisioning tool as there are significant
benefits to keeping a single tool for all provisioning steps.

## Consequences

The Ansible support for vCloud director through the vcs_vapp module is limited and
doesn't provide all of the options that are required to deploy servers into a JASMIN
tennancy. Given this, it will be necessary to write custom Ansible modules (based on the
existing modules) to support automated provisioning of VMs.
