# Sprint 2

## Sprint Goal

To create an end to end working system deployed in Kubernetes and secured with SSL.

* Develop API container
* Build Kubernetes Cluster
* Deploy all containers to Kubernetes
* Serve all content over HTTPS

## Complete Stories

### From Sprint 1

NERCDL-9 Provision Docker and Proxy using ansible

### New

* NERCDL-21 Create skeleton API application
* NERCDL-22 Configure API build in Travis

* NERCDL-10 Create Kubernetes Cluster servers using Ansible
* NERCDL-11 Add ansible SSH keys to k8s servers using init script
* NERCDL-12 Provision k8s using ansible

* NERCDL-23 Provision API into k8s cluster
* NERCDL-19 Provision React application into k8s cluster
* NERCDL-20 Expose application and configure dynamic proxy to give external access

* NERCDL-29 Configure Domain and SSL for proxy

## Incomplete Stories

No incomplete stories in this sprint

## Investigation Stories

* NERCDL-28 Investigate Auth0 for user administration/SSO
* NERCDL-24 Investigate storage options for k8s

## Demos

### API Demo

#### (NERCDL-21, NERCDL-22)

* Discuss GraphQL
* Show GraphiQL endpoint
* Show Travis Build
* Show DockerHub containers

### Kubernetes Cluster

#### (NERCDL-10, NERCDL-11, NERCDL-12)

* Discuss Ansible scripts
* Show kubectl connection

Discuss missing pieces:

* Storage
* Monitoring

### Deployment to Kubernetes

#### (NERC-9, NERCDL-23, NERCDL-19, NERCDL-20, NERCDL-29)

Show Application served over HTTPS with API link

* [Datalab Application](http://datalab.datalabs.ceh.ac.uk)
* [Datalab API](http://datalab-api.datalabs.ceh.ac.uk)
* [Datalab Docs](http://datalab-docs.datalabs.ceh.ac.uk)

Show documentation served over HTTPS

Discuss change to URL scheme

## Investigations

### Authentication

#### (NERCDL-28)

* Details are in the Story
* Discuss options
* Agree path forward

### Kubernetes Storage

#### (NERCDL-24)

In Progress. Three options:

* NFS Cluster - Wait for OpenStack
* [Rook.io](https://rook.io/) - based on Ceph runs on Kubernetes
* Gluster
