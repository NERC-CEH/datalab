# 7. Kubernetes for container orchestration

Date: 2017-11-04

## Status

Accepted

## Context

We are expecting to have to run a large number of containers across several servers
and in different environments. Given this, we think that we need a Container
Orchestration tool and are selecting between Kubernetes, Docker Swarm and Mesos.

## Decision

We have selected to use Kubernetes as our container orchestration platform. This is due
to it being the choice that the JASMIN team have made and also that it has established
itself as a clear industry favourite.

## Consequences

The team will need to learn Kubernetes as they have no prior experience.
