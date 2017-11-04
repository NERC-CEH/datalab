# 14. Use Traefik for Reverse Proxy

Date: 2017-11-04

## Status

Supercedes [13. Custom Redbird Proxy](0013-custom-redbird-proxy.md)

Superceded by [15. Use Kong for Reverse Proxy](0015-use-kong-for-reverse-proxy.md)

## Context

The Redbird proxy does not support WebSockets which are required to support the
interactive notebooks. We have also had problems with the reliability
of the proxy and have found it difficult to configure.

## Decision

We have decided to replace the custom Redbird proxy with a [Traefik](https://traefik.io/)
proxy as this looks easier to configure and claims Web Socket support.

## Consequences

We need to remove the Redbird proxy code from the repository and DockerHub and write
Ansible provisioning scripts for installing onto the proxy server.
