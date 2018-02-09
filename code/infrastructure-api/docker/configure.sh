#!/bin/bash

VAULT_TOKEN=root
VAULT_API=${VAULT_API:="http://localhost:8200"}

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  --data @config/vault/secret-admin-policy.json \
  $VAULT_API/v1/sys/policy/secret-admin-policy

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"type":"approle"}' \
  $VAULT_API/v1/sys/auth/approle

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"policies":"secret-admin-policy", "bound_cidr_list": "0.0.0.0/0", "bind_secret_id":"false"}' \
  $VAULT_API/v1/auth/approle/role/secret-admin

INFRASTRUCTURE_APP_ROLE=$(curl -s -X GET -H "X-Vault-Token:$VAULT_TOKEN" $VAULT_API/v1/auth/approle/role/secret-admin/role-id | jq .data.role_id)

echo INFRASTRUCTURE export VAULT_APP_ROLE=${INFRASTRUCTURE_APP_ROLE}
