# 5. Docker Containers for Everything

Date: 2017-11-04

## Status

Accepted

## Context

The Datalabs project has challenging vision for dynamic creation of scientific analysis
environments. We need to decide what technology will enable us to meet this vision.

## Decision

We do not think that regular VM orchestration will meet the vision and have instead
opted to deploy all services (where possible) as Docker Containers. Alternative container
technologies were not evaluated as the team has previous Docker experience and it is the
clear leader in this space.

## Consequences

All services and applications will need to be built into Docker containers. This will
require custom Dockerfiles in many circumstances, a build pipeline and registry to store
the containers in.
