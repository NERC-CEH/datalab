#!/bin/bash
set -e

VAULT_API=${VAULT_API:="http://localhost:8200"}
VAULT_TOKEN=${VAULT_TOKEN:="root"}

if [ "$SET_ADMIN_POLICY" ]; then
  echo "Set Vault security policies started: $(date)"

  curl -s -X POST \
    -H "X-Vault-Token:$VAULT_TOKEN" \
    -d '{ "policy": "path \"secret/*\" { capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"] }" }' \
    $VAULT_API/v1/sys/policy/secret-admin-policy

  curl -s -X POST \
    -H "X-Vault-Token:$VAULT_TOKEN" \
    -d '{"type":"approle"}' \
    $VAULT_API/v1/sys/auth/approle

  curl -s -X POST \
    -H "X-Vault-Token:$VAULT_TOKEN" \
    -d '{ "policies": "secret-admin-policy", "bound_cidr_list": "0.0.0.0/0", "bind_secret_id": "false" }' \
    $VAULT_API/v1/auth/approle/role/secret-admin

  echo "Set Vault security policies finished: $(date)"
fi

VAULT_APP_ROLE=$(curl -s -X GET -H "X-Vault-Token:$VAULT_TOKEN" $VAULT_API/v1/auth/approle/role/secret-admin/role-id | jq .data.role_id)

export VAULT_APP_ROLE

sh -c "$*"
