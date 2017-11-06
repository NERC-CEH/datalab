# 9. Bastion for cluster access

Date: 2017-11-04

## Status

Accepted

## Context

It will be necessary to access the servers that form the Datalabs network but we do not
want to expose any services outside of the JASMIN tenancy that we do not have to.

## Decision

We have decided that all access to the cluster will be via a Bastion server over an SSH
connection on port 22. We will restrict access through the firewall to known IP address
ranges including the development workstations, the STFC VPN and the Tessella public IP
address.

This excludes public facing services that should be available over HTTPS on port 443 via
a different route.

## Consequences

All communication with the servers in the cluster will have to be over an SSH tunnel.
This will be straight forward to set up on Linux environments with first class SSH
implementations but will cause problems on Windows machines.

On Linux, use [SSH config](https://linux.die.net/man/5/ssh_config) and
[autossh](http://www.harding.motd.ca/autossh/).
On MacOS, use [SSH Tunnel](https://itunes.apple.com/us/app/ssh-tunnel/id734418810?mt=12).
