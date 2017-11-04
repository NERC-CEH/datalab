# 8. WeaveNet for Overlay Network

Date: 2017-11-04

## Status

Accepted

## Context

Kubernetes does not provide an overlay network out of the box and we need to choose
which one to use from [here](https://kubernetes.io/docs/concepts/cluster-administration/networking/).

## Decision

We have decided to use the [WeaveNet](https://www.weave.works/oss/net/) network as this
has already been used by the JASMIN team. It also appears easy to use and there is good
documentation.

## Consequences

The team does not have any experience using overlay networks so it is not clear what the
consequences of this decision will be.
