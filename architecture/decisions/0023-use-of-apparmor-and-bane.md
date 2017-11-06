# 23. Use of AppArmor and Bane

Date: 2017-11-04

## Status

Accepted

## Context

While Docker containers now provide good root isolation from the host compared to earlier
versions of Docker there are still security risks. We intend to provide sudo access
for users of the Notebook containers and this significantly magnifies the risks.

## Decision

We have decided to use [AppArmor](https://wiki.ubuntu.com/AppArmor) to improve our
container security with the intention to make all policies as restrictive as possible.

To make it easier to build AppArmor profiles we have also decided to use
[Bane](https://github.com/jessfraz/bane).

To further secure containers we have also decided to run all of our custom build
containers as a non root user.

## Consequences

We will be able to provide more secure containers for notebooks.

We will need to build our own containers to allow them to run as non root users.
