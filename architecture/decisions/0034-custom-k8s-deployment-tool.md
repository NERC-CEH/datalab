# 34. Custom k8s deployment tool

Date: 2017-11-05

## Status

Superseded by [44. Use Helm as Kubernetes deployment tool](0044-use-helm-as-k8s-deployment-tool.md).

## Context

We need a mechanism to allow Kubernetes manifest files to be applied to different
environments as currently we would have to manually update them in order to apply them to
different environments. The options available are to either use
[Helm](https://github.com/kubernetes/helm) or to build a custom tool.

## Decision

We have decided to build a custom tool called Bara to deploy our templates. This will use
the simple mustache rendering engine to allow template YAML files to be rendered and then
applied using the command line `kubectl` tool.

This approach seemed easier than learning and deploying Helm and building Helm charts for
each independent component given our current requirements are very simple and the tool
will only take a few hours to write.

## Consequences

We will need to develop and maintain the deployment tool.

We will have to update all of our deployment files to template out the parameters that
must be replaced between environments.
