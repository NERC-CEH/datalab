# 42. Remove Discourse from DataLab Stack

Date: 2019-12-05

## Status

Accepted

## Context

We originally provisioned a discourse instance alongside DataLab as a user forum, however
in practise we have found that it is not used as discussion takes place either in
person or on Slack, and we can use the documentation page where required.

## Decision

Discourse will be removed from the stack.

## Consequences

UI links for Discourse should be removed, as should the code which deploys it onto Kubernetes.

Ansible playbooks / Terraform should also be altered accordingly.
