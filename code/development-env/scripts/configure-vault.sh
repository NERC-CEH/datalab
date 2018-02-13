#!/bin/bash

VAULT_API=${VAULT_API:="http://localhost:8200"}
VAULT_TOKEN=${VAULT_TOKEN:="root"}

# Keeps directory relative
SCRIPT_DIR=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  --data @${SCRIPT_DIR}/../config/vault/secret-admin-policy.json \
  $VAULT_API/v1/sys/policy/secret-admin-policy

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"type":"approle"}' \
  $VAULT_API/v1/sys/auth/approle

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"policies":"secret-admin-policy", "bound_cidr_list": "0.0.0.0/0", "bind_secret_id":"false"}' \
  $VAULT_API/v1/auth/approle/role/secret-admin

VAULT_APP_ROLE=$(curl -s -X GET -H "X-Vault-Token:$VAULT_TOKEN" $VAULT_API/v1/auth/approle/role/secret-admin/role-id | jq .data.role_id)

echo "export VAULT_APP_ROLE=${VAULT_APP_ROLE}"

# Clear unneed variables
unset SCRIPT_DIR
