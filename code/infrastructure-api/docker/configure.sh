#!/bin/bash

curl -i -X POST http://localhost:8002/certificates \
    -F "cert=testcert" \
    -F "key=testkey" \
    -F "snis=testlab.test-datalabs.nerc.ac.uk"

VAULT_TOKEN=root
VAULT_ADDR=http://localhost:8200

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  --data @config/vault/secret-admin-policy.json \
  $VAULT_ADDR/v1/sys/policy/secret-admin-policy

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"type":"approle"}' \
  $VAULT_ADDR/v1/sys/auth/approle

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"policies":"secret-admin-policy", "bound_cidr_list": "172.0.0.0/8", "bind_secret_id":"false"}' \
  $VAULT_ADDR/v1/auth/approle/role/secret-admin

INFRASTRUCTURE_APP_ROLE=$(curl -s -X GET -H "X-Vault-Token:$VAULT_TOKEN" http://127.0.0.1:8200/v1/auth/approle/role/secret-admin/role-id | jq .data.role_id)

echo INFRASTRUCTURE export VAULT_APP_ROLE=${INFRASTRUCTURE_APP_ROLE}
