# Configuring local wildcard DNS records

To be able to resolve the development environment via
`http://testlab.datalabs.internal/` a wildcard DNS record must present locally.
We configure this record to proxy request to the ingress controller running in
Minikube.

## MacOS

These instructions are adapted from this
[blog post](https://blog.thesparktree.com/local-development-with-wildcard-dns).

### Update DNSMasq config

Check the IP address used by Minikube and update `datalabs-dnsmasq.conf`; this
is expected to be 192.168.99.100.

```bash
minikube ip
```

VirtualBox will retain leases for local IP address, when creating a new cluster
a new IP address will be assigned. These can be cleared by deleting VirtualBox
DHCP leases (`rm ~/Library/VirtualBox/HostInterfaceNetworking-vboxnet0-Dhcpd.*`)

```bash
cp ./datalab-dnsmasq.conf $(brew --prefix)/etc/dnsmasq.conf
```

Restart the DNSMasq daemon, this must be restart whenever the configuration file
is updated.

```bash
sudo brew services start dnsmasq
```

Add a resolver record to loopback to localhost.

```bash
sudo mkdir -p /etc/resolver
sudo bash -c 'echo "nameserver 127.0.0.1" > /etc/resolver/datalabs.internal'
```

## GNU/Linux

DNSMasq may also used to configured a locally resolving wildcard DNS record for
linux, however updating the resolver can be a little more tricky ([see this post
for more details](https://askubuntu.com/a/1031896)).