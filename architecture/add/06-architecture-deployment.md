# Deployment View

This section details the datalabs architecture from the view-point of its deployment.

## Containerisation vs Virtualisation

The core requirement of Datalabs is runtime flexibility. The intention is to provide a
rich, dynamic environment to users. Two options were considered, containerisation and
virtualisation ([ARD-0005](../decisions/0005-docker-containers-for-everything.md)). The
decision was to adopt a containerisation approach as fast starting containers with a
more flexible resource sharing model is a much closer match to the datalabs vision.

While we anticipate using Docker containers wherever possible this does not rule out the
option of using virtual machines for specific use cases. One possibility is to provide
users with Desktop as a Service as serving a desktop from a container is unlikely to work
well.

## Kubernetes

TODO: Add Kubernetes content

### Kubernetes Primer

### Deployment Structure
