# Using custom DNS -  Linux

Add 127.0.0.1 to TOP of DNS servers list. This can be found on GNOME via Network
Setting > Wired > Setting (cog icon), IPv4, DNS.


# Start dnsmasq

Check IP address in configuration file matches that for minikube. Run command
below in new terminal window.

```bash
sudo dnsmasq -C datalab-dnsmasq.conf -k
```
