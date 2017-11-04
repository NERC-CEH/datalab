# 16. Glusterfs for storage

Date: 2017-11-04

## Status

Accepted

## Context

Containers running on Kubernetes only provide ephemeral storage. We need to provide
persistent storage that allows volumes to be mounted into multiple containers. This
restricts us to [Kubernetes Volume Types](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) that support "Read Write Many". Specifically, we are selecting
between [NFS](https://help.ubuntu.com/lts/serverguide/network-file-system.html),
[GlusterFS](https://www.gluster.org/) and [Rook](https://rook.io/).

## Decision

We have decided to use GlusterFS to provide distributed persistent storage.

We have opted not to use Rook as it feels that it isn't yet ready for production usage. Also, while it would be easy to deploy hyper-converged we would need a second Kubernetes
cluster to run isolated storage as we require.

We feel that simple NFS storage isn't sufficient as it won't give any data resilience.
Given we have no backups, the data replication will give us limited disaster recover
capability.

## Consequences

We haven't yet confirmed the Kubernetes integration via Heketi and may not be able to
use Kubernetes storage abstractions later.
