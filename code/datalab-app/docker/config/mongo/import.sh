#!/bin/bash
set -e

echo "Job Import started: $(date)"

mongoimport --quiet --host $MONGO_HOST:$MONGO_PORT --db $MONGO_DB_NAME --collection datalabs --type json --drop --file /tmp/mongodb/datalabCollection.json --jsonArray
mongoimport --quiet --host $MONGO_HOST:$MONGO_PORT --db $MONGO_DB_NAME --collection stacks --type json --drop --file /tmp/mongodb/stackCollection.json --jsonArray
mongoimport --quiet --host $MONGO_HOST:$MONGO_PORT --db $MONGO_DB_NAME --collection dataStorage --type json --drop --file /tmp/mongodb/dataStorageCollection.json --jsonArray

echo "Job Import finished: $(date)"
