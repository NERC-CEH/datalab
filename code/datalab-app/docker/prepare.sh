#!/bin/bash
VAULT_TOKEN=root
VAULT_ADDR=http://localhost:8200

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  --data @config/vault/policies/datalab-policy.json \
  $VAULT_ADDR/v1/sys/policy/datalab-policy

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  --data @config/vault/policies/secret-admin-policy.json \
  $VAULT_ADDR/v1/sys/policy/secret-admin-policy

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"type":"approle"}' \
  $VAULT_ADDR/v1/sys/auth/approle

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"policies":"datalab-policy", "bound_cidr_list": "172.0.0.0/8", "bind_secret_id":"false"}' \
  $VAULT_ADDR/v1/auth/approle/role/datalab

curl -X POST \
  -H "X-Vault-Token:$VAULT_TOKEN" \
  -d '{"policies":"secret-admin-policy", "bound_cidr_list": "172.0.0.0/8", "bind_secret_id":"false"}' \
  $VAULT_ADDR/v1/auth/approle/role/secret-admin

# Add default keys
curl -X POST -H "X-Vault-Token:$VAULT_TOKEN" -d '{"access_key":"VXL8C2ITGFBVMHKV2EV6","secret_key":"iUOhbVYNRxJS2X+5Ukpvsk01TsVWxbdERaNGf5kI"}' http://127.0.0.1:8200/v1/secret/testlab/storage/disk-1
curl -X POST -H "X-Vault-Token:$VAULT_TOKEN" -d '{"username":"datalab","password":"password"}' http://127.0.0.1:8200/v1/secret/testlab/notebooks/zeppelin
curl -X POST -H "X-Vault-Token:$VAULT_TOKEN" -d '{"username":"rstudio","password":"rstudio"}' http://127.0.0.1:8200/v1/secret/testlab/notebooks/rstudio
curl -X POST -H "X-Vault-Token:$VAULT_TOKEN" -d '{"token":"jupyterToken"}' http://127.0.0.1:8200/v1/secret/testlab/notebooks/jupyter


# Configure Proxy Routes for Jupyter
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-jupyter' --data 'hosts=testlab-jupyter.datalabs.local' \
    --data 'upstream_url=http://jupyter:8888' --data 'preserve_host=true'

# Configure Proxy Routes for Zeppelin
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-zeppelin' --data 'hosts=testlab-zeppelin.datalabs.local' \
    --data 'upstream_url=http://zeppelin:8080' --data 'strip_uri=true' --data 'preserve_host=true'
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-zeppelin-connect' --data 'hosts=testlab-zeppelin.datalabs.local' \
    --data 'upstream_url=http://zeppelin-connect:8000' --data 'uris=/connect' --data 'strip_uri=true'

# Configure Proxy Routes for RStudio
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-rstudio' --data 'hosts=testlab-rstudio.datalabs.local' \
    --data 'upstream_url=http://rstudio:8787' --data 'strip_uri=true' --data 'preserve_host=true'
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-rstudio-connect' --data 'hosts=testlab-rstudio.datalabs.local' \
    --data 'upstream_url=http://rstudio-connect:8000' --data 'uris=/connect' --data 'strip_uri=true'

# Configure Proxy Routes for Minio
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-minio' --data 'hosts=testlab-minio.datalabs.local' \
    --data 'upstream_url=http://minio:9000' --data 'strip_uri=true' --data 'preserve_host=true'
curl -i -X POST --url http://localhost:8002/apis --data 'name=testlab-minio-connect' --data 'hosts=testlab-minio.datalabs.local' \
    --data 'upstream_url=http://minio-connect' --data 'uris=/connect' --data 'strip_uri=true'

# Log ENV Variables
VAULT_APP_ROLE=$(curl -s -X GET -H "X-Vault-Token:$VAULT_TOKEN" http://127.0.0.1:8200/v1/auth/approle/role/datalab/role-id | jq .data.role_id)
INFRASTRUCTURE_APP_ROLE=$(curl -s -X GET -H "X-Vault-Token:$VAULT_TOKEN" http://127.0.0.1:8200/v1/auth/approle/role/secret-admin/role-id | jq .data.role_id)

echo APP export VAULT_APP_ROLE=${VAULT_APP_ROLE}
echo INFRASTRUCTURE export VAULT_APP_ROLE=${INFRASTRUCTURE_APP_ROLE}