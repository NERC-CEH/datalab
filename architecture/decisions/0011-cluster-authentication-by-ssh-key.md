# 11. Cluster Authentication by SSH key

Date: 2017-11-04

## Status

Accepted

## Context

We need to configure access to the servers in the cluster and need to decide between
password authentication and SSH key pair authentication.

## Decision

We have decided that all server log on authentication will use SSH key pair
authentication. The public keys will be provisioned onto the server at server creation
for the default deploy user. A password will be required for sudo.

## Consequences

All administrators will require SSH key pairs.
