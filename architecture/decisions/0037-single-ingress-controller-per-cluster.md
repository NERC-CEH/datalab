# 37. Single Ingress Controller for Kubernetes Cluster

Date: 2019-08-21

## Status

Accepted

## Context

Currently we have an Nginx Ingress controller deployed in the same namespace
as the Datalabs application. This means that when multiple instances of
Datalabs are deployed to a single cluster (such as prod and test), ingress
controllers are deployed to each of these namespaces.

As we are in the process of implementing multiple project functionality within
Datlabs, there is now a need for an ingress controller than can fulfill ingress
rules across all namespaces. This also will move control of ingress to be a
platform service and not part of the deployment of the application itself,
which will aid to decouple Datalabs into being more of a standalone
application.

## Decision

We have decided to deploy a single Nginx Ingress Controller into the
kube-system namespace that will handle the ingress rules for the entire
cluster.

## Consequences

We need to edit the deployment process to deploy a single ingress controller in
the kube-system namespace.

Minor configuration of the ingress controller will be required to use a default
SSL certificate in order for ingresses in all namespaces to make use of it.

Without further configuration of the URL scheme to distinguish between Datalabs
instances, only one can be deployed in a Kubernetes cluster at any time. This
is due to the need for different wildcard certificates and the fact they do not
support subdomains.

