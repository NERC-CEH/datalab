# 36. Replace Kong with Nginx Ingress Controller

Date: 2017-11-05

## Status

Accepted

Supercedes [15. Use Kong for Reverse Proxy](0015-use-kong-for-reverse-proxy.md)

## Context

We have reached a point where we need to secure third party web applications that provide
no security of their own. The Kong proxy does not offer a mechanism for this in the open
source version and we haven't had and response from our efforts to contact them.

We believe that the Nginx Ingress controller that has been available since Kubernetes 1.7
was released provides a Kubernetes native route for the same functionality.

## Decision

We have decided the replace the Kong proxy with an Nginx Ingress Controller in the
Kubernetes cluster and an Nginx load balancer running on the proxy servers.

This should provide all of the same functionality as Kong and in addition should provide
a mechanism for token and cookie authentication using the `auth_url` annotation that
wraps the underlying Nginx `auth_request` module.

## Consequences

We need to create the Ingress controller in the cluster.

The existing proxies need to be replaced with load balancers (or simple pass through
proxy if single Ingress Controller).

The existing rules need to be migrated.

The Infrastructure Service needs to be updated to create Ingress Rules rather than Kong
API rules.

We need to build a default backend service.

We need to build an authentication service to redirect inbound requests to.
