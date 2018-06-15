# Trouble shooting guide

Datalabs is a very large system and there are a lot of moving pieces. This makes it very
difficult to write a concise trouble shooting guide to cover all scenarios.

Ideally Datalabs would provide log aggregation through EFK and monitoring through
Prometheus and Grafana but this phase of the project has been unable to deliver these
observability tools.

This section highlights some entry points into the system to identify which part may be
failing.

## Check Kubernetes Status

```
# Ensure that all nodes are healty
kubectl get nodes

# Ensure that all pods are health
kubectl get pods --all-namespaces

# View logs for a pod
kubectl logs -n <namespace> <pod-name>

# Describe a resource
kubectl describe -n <namespace> <resource> <resource-name>
```

## Check Server Status

First check the server status through the
[JASMIN dashboard](https://cloud-beta.jasmin.ac.uk/tenancies/1702d44056d347b7bd54693d83a37d56)

Next check that Ansible is able to contact all servers. From a local Ansible management
machine execute

```
ansible -m ping all
```

You should expect a success response from all healthy servers.

## Confluence

There is useful content in Confluence which may not have made it into this documentation.
[Support](https://wiki.ceh.ac.uk/display/nercdl/Support).

## Runbooks

Each time an issue is encountered and resolved in the system a runbook will be added to
this section.

* [Error creating dynamic storage](./runbooks/01-error-creating-dynamic-storage.mb)
