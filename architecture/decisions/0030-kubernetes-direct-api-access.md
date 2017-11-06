# 30. Kubernetes direct API access

Date: 2017-11-05

## Status

Accepted

## Context

In order to dynamically orchestrate the containers running in the Datalab environment we
need to interact with the Kubernetes API. There are several choices for this:

* Use one of the officially [supported clients](https://kubernetes.io/docs/reference/client-libraries/#officially-supported-kubernetes-client-libraries).
* Use one of the Node.js community clients
* Directly interact with the Kubernetes REST API.

## Decision

We have decided to directly interact with the Kubernetes REST API as this presented the
easiest option for development.

We ruled out using a supported client as we didn't want to have to write a service in a
language we were not familiar with.

We trialled all of the Node.js community clients but didn't feel that they were complete
enough to meet our needs and were poorly documented.

## Consequences

We will need to track the Kubernetes API as it evolves. Many of the APIs are not yet
stable so we do expect to need updates when the cluster version updates. Fortunately,
the Kubernetes team are careful with their upgrades and ensure a planned deprecation.

We will need to test the API client prior to making cluster upgrades.
