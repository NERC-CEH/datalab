# 31. Kubernetes namespace for environment isolation

Date: 2017-11-05

## Status

Accepted

## Context

We need to run multiple instances of the Datalabs system to allow us to continue to
develop while giving early adopters access to the system. We intend to run both a test
and production environment and need to decide whether to do this as a completely separate
Kubernetes cluster or to isolate the environments using Kubernetes namespaces.

## Decision

We have decided to run both environments on the same Kubernetes cluster but with a
separate reverse proxy to allow testing of the proxy configuration. This decision was
taken to avoid the maintenance overhead of having two clusters.

## Consequences

A single cluster means that there is a risk that production and test services may be
able to communicate with each other. This can be mitigated with the use of a Kubernetes
network policy.

There is a risk that issues caused by one environment may impact the other. Long term
we will need to consider resource quotas if we are going to remain in this configuration.
