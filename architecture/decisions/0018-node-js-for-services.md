# 18. Node.js for services

Date: 2017-11-04

## Status

Accepted

## Context

We need to select a language for our web services. We restricted our options to Java,
Node.js and Go.

## Decision

We have decided to use [Node.js](https://nodejs.org/en/) for our web services. We felt that the existing team
experience, combined with the flexibility provided by a dynamic language made this the
right choice.

Java would have provided static typing and object orientation but we opted against this
as it felt a little heavy weight.

Go would have provided a lighter weight modern statically typed option but given neither
the team nor Tessella had existing experience we viewed it as too great a risk for this
project.

## Consequences

Integration with Kubernetes may be harder in Node.js than it would be in Go as there is
no supported client. If it does prove too difficult then we still have the option to
build a dedicated service in Go for the Kubernetes integration.
