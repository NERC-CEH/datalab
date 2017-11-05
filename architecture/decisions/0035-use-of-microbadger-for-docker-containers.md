# 35. Use of MicroBadger for Docker containers

Date: 2017-11-05

## Status

Accepted

## Context

We have a growing number of Docker containers and it is useful to have at a glance
information available about them. [MicroBadger](https://microbadger.com/) provides
a way to inspect and visualise Docker containers.

## Decision

We have decided to use MicroBadger for new containers and will update existing containers
as we make updates to them.

## Consequences

We will have consistently badged containers giving easy access to container information.

We will need to add DockerHub build hooks to any containers built in DockerHub in order
to inject the information required into the build step.
