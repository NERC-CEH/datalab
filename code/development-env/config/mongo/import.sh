#!/bin/bash
set -e

echo "Job Import started: $(date)"

mongoimport -u datalabs -p datalabs --quiet --host $MONGO_HOST:$MONGO_PORT --db $MONGO_DATALAB_DB_NAME --collection datalabs --type json --drop --file /tmp/mongodb/datalabCollection.json --jsonArray --authenticationDatabase admin
mongoimport -u datalabs -p datalabs --quiet --host $MONGO_HOST:$MONGO_PORT --db $MONGO_DATALAB_DB_NAME --collection dataStorage --type json --drop --file /tmp/mongodb/dataStorageCollection.json --jsonArray --authenticationDatabase admin
mongoimport -u datalabs -p datalabs --quiet --host $MONGO_HOST:$MONGO_PORT --db $MONGO_INFRASTRUCTURE_DB_NAME --collection stacks --type json --drop --file /tmp/mongodb/stackCollection.json --jsonArray --authenticationDatabase admin

echo "Job Import finished: $(date)"
