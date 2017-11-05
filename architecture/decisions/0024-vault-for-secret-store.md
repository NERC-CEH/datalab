# 24. Vault for Secret Store

Date: 2017-11-04

## Status

Accepted

## Context

In order to dynamically provide secure Notebook containers it will be necessary to
dynamically generate and securely store secrets. We want to isolate this from the
database and use a dedicated solution for this problem.

## Decision

We have decided to use [Hashicorp Vault](https://www.vaultproject.io/) to store secrets.
It provides a dedicated system to securely store and manage access to secrets.

## Consequences

We have a flexible system to store secrets in a way that can be securely access from all
services.
