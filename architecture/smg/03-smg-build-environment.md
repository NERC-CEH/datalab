# Build Environment

There are two development environments required for datalabs:

* Developing the datalabs code - Recommended to be on development laptop
* Developing the infrastructure code - A vagrant VM is provided as configuration of the runtime environment is involved. Code editing should be done on the host development laptop.

> It is strongly recommended that Datalabs development is done on either MacOS or Linux.
The development experience on Windows is poor, mainly due to Windows having a poor
terminal. The Ubuntu system turned out not to be sufficient particularly for running
Docker and Minikube.

## Tools

There are a number of tools required for development:

* [Node](https://nodejs.org/en/) - Datalabs is all written in Node.js - recommend [nvm](https://github.com/creationix/nvm) for managing node versions.
* [Yarn](https://yarnpkg.com/lang/en/) - Yarn is used as the package manager over npm
* [Docker for Mac](https://www.docker.com/docker-mac)
* [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
* [Vagrant](https://www.vagrantup.com/)
* [VirtualBox](https://www.virtualbox.org/)
* JavaScript IDE - [IntelliJ](https://www.jetbrains.com/idea/), [Atom](https://atom.io/), [VSCode](https://code.visualstudio.com/)
* [Insomnia](https://insomnia.rest/)
* [Git](https://git-scm.com/)

## Datalabs Development Environment

Instructions for running a full development environment are kept with the source code to
ensure that they remain up to date as the system evolves. They can be found [here](../../code/development-env/README.md).

## Infrastructure Development Environment

Infrastructure development requires a number of tools and supporting libraries to be
configured. Rather than write documentation about how to install them an Ansible script
has been written to allow the automated provisioning of a Vagrant box to use for
datalabs infrastructure management.

Instructions for initialising and configuring an infrastructure management environment
are kept with the source code to ensure that they remain up to date as the system
evolves. They can be found [here](../../code/provision/infrastructure/README.md).
