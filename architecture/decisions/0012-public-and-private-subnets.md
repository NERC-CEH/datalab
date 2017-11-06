# 12. Public and Private Subnets

Date: 2017-11-04

## Status

Accepted

## Context

We would like to minimise our externally exposed footprint. To achieve this we have
already decided that access to cluster servers will be via a Bastion server. We do need
to have some externally accessible services and need to decide how to achieve this.

## Decision

We have decided to have external proxy servers for each environment that expose ports 80
and 443 to the public Internet by assigning a NAT in the vCloud environment. These proxy
servers will route traffic to the Kubernetes cluster services based on the Host Headers.

## Consequences

There will be two groups of servers. Those available over the public Internet and those
only available via the Bastion. We need to ensure that we place servers and services
correctly into these groups.
