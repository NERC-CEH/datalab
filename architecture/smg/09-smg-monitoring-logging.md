# Monitoring and Logging

This document provides information about the Monitoring and Logging solution for Datalabs.

Monitoring and alerting is being provided through the use of the Prometheus Operator which deploys Prometheus Server, AlertManager and Grafana onto the cluster.

The log aggregation solution is provided using the Elasticsearch, Fluentd, Kibana(EFK) stack.

## Access Prometheus UI

Access via Kubernetes port-forwarding

```bash
kubectl port-forward $(kubectl get pods --selector=app=prometheus -n prometheus --output=jsonpath="{.items..metadata.name}") -n prometheus 9090:9090
```

## Access Grafana

To access Grafana point to {{ datalabName }}-monitoring.{{ domain }} where {{ datalabName }} is the datalab instance and {{ domain }} is the domain name. Currently we have deployed using the testlab instance and grafana is available at <https://testlab-monitoring.test-datalabs.nerc.ac.uk.> Then login with Github credentials.

## Access Kibana

To access DataLabs logs

```bash
kubectl port-forward $(kubectl get pods --selector=app=kibana -n efk-logging --output=jsonpath="{.items..metadata.name}") -n efk-logging 5601:5601
```