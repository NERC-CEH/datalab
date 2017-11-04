# 2. Ansible for provisioning tool

Date: 2017-11-04

## Status

Accepted

## Context

We need a tool to provision servers and software for the datalabs project.

## Decision

We will use Ansible as our provisioning tool as both the JASMIN DevOps team and Tessella
team have experience using it.

## Consequences

Ansible does not support Windows meaning that additional work will be required to allow
administration from Windows laptops. This is not seen to be an issue as the project
team have been provided with Linux workstations on the client network.
