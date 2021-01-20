#!/bin/bash

# Give the command line arguments meaningful names
domain=$1
ip=$2

# Add an entry to /etc/resolver so Mac uses dnsmasq for the domain
# (ref https://blog.thesparktree.com/local-development-with-wildcard-dns)
cat << EOF | sudo tee "/etc/resolver/$domain"
nameserver 127.0.0.1
EOF

# Create the necessary dnsmasq config file to resolve the domain name to the IP address
# Write to where brew installed dnsmasq expects the config file to be
cat << EOF > "$(brew --prefix)"/etc/dnsmasq.conf
address=/$domain/$ip

no-resolv
domain-needed
bogus-priv
EOF

# restart dnsmasq to pick up the config changes
sudo brew services restart dnsmasq
