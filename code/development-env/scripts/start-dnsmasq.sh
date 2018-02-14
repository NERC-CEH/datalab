#!/bin/bash

# Keeps directory relative
SCRIPT_DIR=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")

sudo dnsmasq -C ${SCRIPT_DIR}/../config/dnsmasq/datalab-dnsmasq.conf -k
