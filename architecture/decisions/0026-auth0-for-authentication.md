# 26. Auth0 for authentication

Date: 2017-11-04

## Status

Accepted

## Context

User Authentication is a complex problem, can be time consuming to implement and errors
in implementation can lead to security vulnerabilities. We feel that authentication,
while critical, is not a differentiating factor and want to offload the work to a
managed service.

## Decision

We have opted to use [Auth0](https://auth0.com/) as our Identify provider. This gives us
a quick way to integrate authentication into our application with minimal effort and as
an open source project we are able to use the service free of charge.

## Consequences

We have a high quality identity provider with a rich management interface to get us
started with user management workflows and identity.

Auth0 also provides an extensive management API which will allow us to build our own
interfaces in the longer term if we choose.

Auth0 provides the capability to federate identity with other identity providers. We may
want to allow user to authenticate using their CEDA accounts or Crowd accounts (in the
case of CEH) in the longer term.
