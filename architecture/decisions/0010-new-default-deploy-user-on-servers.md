# 10. New default deploy user on servers

Date: 2017-11-04

## Status

Accepted

## Context

In order to use Ansible to provision the servers there needs to be a user with sudo
access. The default administrator user configured onto the base VM is not configured
correctly and we are unable to use SSH keypairs with this user. After investigation
we are not clear what the issue is with the administrator user and need alternative
option.

## Decision

We have decided to remove the password authentication from the administrator user having
first provisioned a new deploy user with ssh keys for the team in the authorized keys.
This user will require a password for sudo which will be stored in the ansible vault to
allow automated provisioning.

## Consequences

SSH public keys need to be stored in the Ansible vault to allow provisioning onto
machines. The sudo password also need to live in the vault to allow automated
provisioning.
