# Provisioning

This document describes how to create and use Ansible control environment. A number of tools are used in this process including VirtualBox, Vagrant and Ansible.

The current development environment is CentOS 7 and instructions have only been tested in this environment.

## Machine setup

### Install VirtualBox

Instructions followed from [here](https://wiki.centos.org/HowTos/Virtualization/VirtualBox)

Add the repo

```
cd /etc/yum.repos.d
wget http://download.virtualbox.org/virtualbox/rpm/rhel/virtualbox.repo
```

Install DKMS (Dynamic Kernel Module Support)

```
yum --enablerepo=epel install dkms
```

Search for available packages and install the selected version

```
yum search VirtualBox
sudo yum install VirtualBox-5.1.x86_64
```

### Install Vagrant

Download from the [Vagrant](https://www.vagrantup.com/downloads.html) website.

Install using ```rpm```

```
sudo rpm -i <package-name>
```

### Create Ansible control VM

Create the Ansible control VM by executing ```vagrant up``` in the ```code/provision``` directory.

## Using Ansible control VM

SSH onto the ansible control machine using ```vagrant ssh```.

Start an SSH agent to avoid having to continually supply the SSH key password.

```
ssh-agent bash
ssh-add ~/keys/<ssh_key>
```

Check that Ansible is correctly provisioned by executing

```
ansible <host> -m ping -u <user>
```

where ```user``` is the user to connect as. This will be ```root``` for new machines but initial provisioning will add a new ```deploy``` user and remove the root access.