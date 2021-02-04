# 45. Kubernetes Secrets as Secret Store

Date: 2021-01-22

## Status

Accepted

## Context

Currently, secrets that are dynamically created for notebooks etc. are stored in Hashicorp Vault as decided in [24. Vault for Secret Store](0024-vault-for-secret-store.md).
Vault has been the source of operational challenges such as sealing when it is rescheduled.
This has added extra complexity such as requiring a cronjob to periodically check that Vault has not been sealed.
Vault is also non-trivial to initially configure for use; a concern when aiming for portability across different services, especially those that would be self-serve e.g. JASMIN's Cluster as a Service (CaaS).

## Decision

It has been decided to move to using [Kubernetes' native secret solution](https://kubernetes.io/docs/concepts/configuration/secret) to make DataLabs simpler to both deploy and maintain.

## Consequences

* Developer effort is required to migrate from Vault to Kubernetes secrets.
* DataLabs will be easier to deploy and maintain helping towards our goal of a more portable solution.
