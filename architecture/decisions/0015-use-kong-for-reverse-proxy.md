# 15. Use Kong for Reverse Proxy

Date: 2017-11-04

## Status

Accepted

Supercedes [14. Use Traefik for Reverse Proxy](0014-use-traefik-for-reverse-proxy.md)

## Context

The Traefik proxy does not fully support WebSockets causing problems with the Dask
Dashboard. We have tested using an Nginx proxy and have found that this provides the
support required but does not provide an API for configuration.

## Decision

We have decided to use [Kong](https://getkong.org/) for our reverse proxy as it is a
custom build of Nginx that provides an API. We have tested with all of our services and
it appears to meet our needs.

## Consequences

We need to remove the Traefik proxy, replace with Kong and script the configuration of
the required routes.
