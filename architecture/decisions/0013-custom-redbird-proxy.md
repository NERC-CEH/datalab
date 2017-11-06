# 13. Custom Redbird Proxy

Date: 2017-11-04

## Status

Superceded by [14. Use Traefik for Reverse Proxy](0014-use-traefik-for-reverse-proxy.md)

## Context

We need to select a proxy server to proxy requests to services running in the private
Kubernetes cluster.

## Decision

We have decided to use [RedBird](https://github.com/OptimalBits/redbird) as a reverse
proxy. This was selected as it is written in Node.js which we expect our applications
to be written in and will allow us to extend to support authentication, logging and other
edge concerns.

## Consequences

We will need to package the proxy into a Docker container.
