# Server Provisioning

## Configuring SSH tunnel for provisioning through desktop bastion

The cluster bastion only accepts incoming requests from office locations which makes it
impossible to provision through the bastion directly while working at a remote location.

This can be addressed through careful SSH tunnelling and an adjustment to the
`proxied/vars.yml` to match the configuration.

A setup that has worked is as follows:

* Connect to the STFC VPN to give network access to a desktop machine allowed to
provision (Ice of Mist)
* Create an SSH tunnel to the machine passing a local port to the SSH port on the desktop
For example (localhost:3222 -> desktop:22)
* Reconfigure the proxy SSH configuration to use the tunnel.

```
ansible_ssh_common_args: '-o ForwardAgent=yes -o ProxyCommand="ssh -p 3222 -W %h:%p -q {{ deploy_user }}@10.0.2.2"'
```

Note the IP address `10.0.2.2` is the *HOST IP* for the Vagrant VM that Ansible provisioning is executed from (as localhost is the guest and will not reach the tunnel).

Test the connection with the following command from the VM.

```
ansible -i inventory.yml k8s-master -m ping -u deploy
```
