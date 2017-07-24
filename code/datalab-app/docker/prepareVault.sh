#!/bin/bash
VAULT_TOKEN=root
VAULT_ADDR=http://localhost:8200

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"type":"approle"}' \
  $VAULT_ADDR/v1/sys/auth/approle

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"bound_cidr_list":"127.0.0.1/32"}' \
  $VAULT_ADDR/v1/auth/approle/role/datalab

export VAULT_ROLE=$(curl -s -X GET -H "X-Vault-Token:root" http://127.0.0.1:8200/v1/auth/approle/role/datalab/role-id | jq .data.role_id)

echo $VAULT_ROLE
