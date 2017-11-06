# 17. Separate storage cluster rather than Hyper-converged

Date: 2017-11-04

## Status

Accepted

## Context

We need to decide whether to run our storage cluster as a standalone cluster or
hyper-converged by running pods on the Kubernetes cluster.

## Decision

We have decided to run a standalone storage cluster. The reason for using a separate
cluster is that by keeping the persistent data separate we keep flexibility over the
Kubernetes cluster and can drop and recreate it without having to worry about the data.

## Consequences

We need to provision a new three node cluster for Gluster and provide access from the
Kubernetes cluster.
