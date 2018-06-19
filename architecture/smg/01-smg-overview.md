# System Maintenance Guide

This document provides information about hoe the Datalabs software is constructed and
deployed. It is intended for anyone who needs to maintain the software. It does not
describe how to use the system.

The document is split into the following sections:

* **[Overview](#overview)**
* **[Design](./02-smg-design.md)**
* **[Build Environment](./03-smg-build-environment.md)**
* **[Creating a release](./04-smg-creating-a-release.md)**
* **[Installation and Verification](./05-smg-installation-and-verification.md)**
* **[Maintenance](./06-smg-maintenance.md)**
* **[Troubleshooting](./07-smg-troubleshooting-guide.mg)**
* **[Reference](./08-smg-reference.md)**

## Overview

Datalabs is a broad system with many repositories and use of a large number of cloud
based services. This section provides a complete list with brief descriptions for each.

### Repositories

All code is hosted in the [NERC](https://github.com/NERC-CEH) GitHub organisation.
Access to this repository can be granted by CEH.

All Datalabs repositories are linked to the
[NERC Datalab](https://github.com/orgs/NERC-CEH/teams/nerc-data-lab) and can be viewed
[here](https://github.com/orgs/NERC-CEH/teams/nerc-data-lab/repositories). Note that
while the Datalabs repositories are all public, access to the team pages requires users
to be granted access.

* **[datalab](https://github.com/NERC-CEH/datalab)** - This is the main code base for the datalabs project.
* **[datalab-k8s-manifests](https://github.com/NERC-CEH/datalab-k8s-manifests)** - Holds the deployment manifests and configuration files for deploying Datalabs to Kubernetes.
* **[docker-conect](https://github.com/NERC-CEH/docker-connect)** - Service to provide seamless login to Minio containers.
* **[docker-dask](https://github.com/NERC-CEH/docker-dask)** - Custom docker container for running Dask
* **[docker-default-backend](https://github.com/NERC-CEH/docker-default-backend)** - Custom backend for datalabs. Serves 404 Page Not Found for datalabs ingress.
* **[docker-discourse](https://github.com/NERC-CEH/docker-discourse)** - Docker container for running Discourse. Not used currently as running Discourse in containers was abandoned in favour of a standalone server.
* **[docker-gitbook-builder](https://github.com/NERC-CEH/docker-gitbook-builder)** - Custom Docker container for building GitBook websites.
* **[docker-jupyter-notebook](https://github.com/NERC-CEH/docker-jupyter-notebook)** - Custom Jupyter Notebook container that adds custom analysis libraries
* **[docker-kubectl](https://github.com/NERC-CEH/docker-kubectl)** - Docker container to allow kubectl proxy to run as an ambassador container.
* **[docker-minio](https://github.com/NERC-CEH/docker-minio)** - Custom Minio container to configure users as required for datalabs.
* **[docker-rshiny](https://github.com/NERC-CEH/docker-rshiny)** - Custom RShiny container.
* **[docker-spark](https://github.com/NERC-CEH/docker-spark)** - Custom Spark container
* **[docker-spark-core](https://github.com/NERC-CEH/docker-spark-core)** - Base Spark container with all Spark dependencies. Speeds up container build for changing spark version.
* **[docker-zeppelin](https://github.com/NERC-CEH/docker-zeppelin)** - Custom Zeppelin container.
* **[docker-zeppelin-connect](https://github.com/NERC-CEH/docker-zeppelin-connect)** - Docker container to provide seamless login for Zeppelin and RShiny projects.
* **[terraform-http-backend](https://github.com/NERC-CEH/terraform-http-backend)** - Custom Terraform state server for storing Terraform state over HTTP.

### Tools

Project development and management makes use of the following tools.

* **[Jira](https://jira.ceh.ac.uk/secure/RapidBoard.jspa?projectKey=NERCDL&rapidView=236&view=planning.nodetail)** - Development follows a scrum methodology and all stories are tracked in Jira.
* **[Travis CI](https://travis-ci.org/NERC-CEH/datalab)** - Travis is used as our continuous integration server and is free for open source use. Build is configured via a `.travis.yml` file in the root of the Datalab repository.
* **[Code Climate](https://codeclimate.com/github/NERC-CEH/datalab)** - Code climate provides code linting and quality checks. It is automatically run against all PRs and the master branch and new issues reject PRs.
* **[DockerHub](https://hub.docker.com/u/nerc/)** - DockerHub is used as a store for all of the projects containers. The core project containers are built and published from Travis, but the standalone containers for third party services are all build using DockerHub build for simplicity.
* **[Confluence](https://wiki.ceh.ac.uk/pages/viewpage.action?spaceKey=nercdl&title=NERC+Data+Labs)** - Confluence provides a Wiki for Datalabs. There is a lot of useful information it here including some content that should probably be in this guide.
* **[Jasmin Cloud services](https://cloud.jasmin.ac.uk)** - JASMIN provides the cloud hosting platform for the project. While the UI is useful to view resources, all management is performed via scripts.
