# 44. Use Helm as Kubernetes deployment tool

Date: 2020-12-14

## Status

Accepted

## Context

In [ADR 34](0034-custom-k8s-deployment-tool.md), it was decided that a custom tool would be created instead of using [Helm](https://helm.sh/).
Since this decision was made, Helm has matured and established itself as _the_ way to share and install applications that run in Kubernetes.
It is now desirable to ensure that DataLabs is a portable solution that could easily be installed in other Kubernetes clusters.
With this in mind, the decision to write and use the custom tool, Bara, needs to be reconsidered.

## Decision

We have decided that we should use Helm rather than continuing to use Bara.
This will aid with the portability of the system as Helm is the established way of installing applications into Kubernetes meaning it should be familiar to others installing DataLabs.
As Helm is well established, cloud providers tend to have support for installing via Helm, simplifying potential deployments to the cloud.
Helm also provides mechanisms that allow for the installation of complicated applications into Kubernetes, therefore should  provide DataLabs with plenty of room to grow.

## Consequences

* We will need to update the existing Bara templates such that they can be used with Helm.
* The development team will need to get up to speed with working with Helm (this is a well documented tool and is widely used when working with Kubernetes).
* It should be easier to install DataLabs in other locations such as on a cloud provider e.g. Azure.
