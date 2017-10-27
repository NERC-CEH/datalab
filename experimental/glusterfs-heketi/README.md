# GlusterFS - Heketi Distributed Filesystem Configuration

This creates a distributed filesystem on two servers using [GlusterFS](http://www.gluster.org/) and provides configuration to run the Heketi in a Docker container.

## Building the VMs

  1. Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads).
  2. Download and install [Vagrant](http://www.vagrantup.com/downloads.html).
  3. Install [Ansible](http://docs.ansible.com/ansible/latest/intro_installation.html).
  4. Run `ansible-galaxy install -r requirements.yml` in this directory to get the required Ansible roles.
  5. Run `vagrant up` to build the VMs.

## Starting Heketi

Once the VMs are up the Heketi container can be started and the defined topology imported.

To start the container

```bash
docker run -d -p 8080:8080 -v ~/.vagrant.d/insecure_private_key:/keys/private_key -v $PWD/heketi-docker/config:/etc/heketi -v $PWD/heketi-docker/db:/var/lib/heketi heketi/heketi:latest
```

To import the topology:

```bash
# Docker exec into the container
docker exec -it <container_id> bash

# Import topology
heketi-cli topology load --json=/etc/heketi/topology.json
```

To view the information about the imported topology:

```bash
heketi-cli topology info
```
