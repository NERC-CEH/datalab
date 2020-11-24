#!/bin/bash
set -e

echo "Job Import started: $(date)"

/opt/jboss/keycloak/bin/kcadm.sh config credentials --user admin --password admin --server http://$KEYCLOAK_INSTANCE:8080/auth --realm master
/opt/jboss/keycloak/bin/kcadm.sh create realms -s realm=DataLabs -s enabled=true
/opt/jboss/keycloak/bin/kcadm.sh create users -r DataLabs -s username=admin -s enabled=true
/opt/jboss/keycloak/bin/kcadm.sh set-password -r DataLabs --username admin --new-password admin
/opt/jboss/keycloak/bin/kcadm.sh create clients -r DataLabs -s clientId=datalabs -s 'webOrigins=["*"]' -s 'redirectUris=["*"]' -s '"implicitFlowEnabled"=1' -s '"publicClient"=1'

echo "Job Import finished: $(date)"

