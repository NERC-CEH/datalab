# 24. Vault for Secret Store

Date: 2017-11-04

## Status

Superseded by [45. Kubernetes Secrets as Secret Store](0045-kubernetes-secrets-as-secret-store.md).

## Context

In order to dynamically provide secure Notebook containers it will be necessary to
dynamically generate and securely store secrets. We want to isolate this from the
database and use a dedicated solution for this problem.

## Decision

We have decided to use [Hashicorp Vault](https://www.vaultproject.io/) to store secrets.
It provides a dedicated system to securely store and manage access to secrets.

## Consequences

We have a flexible system to store secrets in a way that can be securely accessed from all
services.
