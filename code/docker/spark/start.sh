#!/bin/bash

unset SPARK_MASTER_PORT

ROLE="${SPARK_ROLE:?Must be set to MASTER or WORKER}"

if [ ${ROLE} = "MASTER" ]; then
  echo "MASTER Node"
  echo "$(hostname -i) spark-master" >> /etc/hosts

  /opt/spark/sbin/start-master.sh --ip spark-master --port 7077
else
  echo "WORKER Node"
  /opt/spark/sbin/start-slave.sh spark://spark-master:7077
fi
