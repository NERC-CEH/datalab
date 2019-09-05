# 39. Prometheus Operator Helm Chart

Date: 2019-09-02

## Status

Accepted

## Context

We need to decide between [Kube Prometheus](https://github.com/coreos/kube-prometheus)
and [Prometheus Operator](https://github.com/helm/charts/tree/master/stable/prometheus-operator)
for use in deploying the prometheus monitoring solution for DataLabs.

## Decision

We have decided to use the [Prometheus Operator Helm Chart](https://github.com/helm/charts/tree/master/stable/prometheus-operator)
as it gives us the option to use an Helm chart over kubectl used in the kube-prometheus
option. The Prometheus Operator Helm chart provides a similar feature set to the
kube-prometheus option.

## Consequences

We will need to write a custom values.yml for use in our deployment. We also need to
update the existing Prometheus Ansible role to deploy the Helm Chart.
