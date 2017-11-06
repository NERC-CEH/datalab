# 6. DockerHub for container registry

Date: 2017-11-04

## Status

Accepted

## Context

Having selected to run all services and applications in Docker containers we need a
registry to store them in.

## Decision

We have decided to store the Docker containers in [DockerHub](https://hub.docker.com/u/nerc/dashboard/). Given the project is Open Source this seemed to be the easiest option
as most tools default to this registry.

## Consequences

All containers will need to be built and pushed to DockerHub and will be publicly
available. This is fine as we are an Open Source Project.
