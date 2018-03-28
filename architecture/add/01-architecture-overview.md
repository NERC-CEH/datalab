# Architectural Description

## Contents

* **[Introduction](#introduction)**
* **[Architectural Background](#architectural-background)**
* **[Architecture Decision Records](../decisions)**

## Introduction

This document is intended to provide an architectural description of the Datalabs
platform.

This is a living document and will evolve as we continue to develop the system.

### Goals

The goal of the Datalabs system is to provide a cloud based computing environment that
gives the UK climate science community access to modern tools and the scalable compute
that JASMIN provides.

### Scope

This architectural description is intended to describe the Datalabs components and
services, how they communicate and what technologies are being used. It is targeted at a
technical audience and assumes understanding of many of the underlying technologies.

## Architectural Background

### Architectural Constraints

The following constraints have been placed on the system:

#### Infrastructure Agnostic

The JASMIN unmanaged cloud is currently provided using VMWare vCloud virtualisation but
it is planned for this to move to OpenStack in the near future. Given this, it is
important that the Datalabs system is built to be independent of the underlying
infrastructure.

#### Open Source

The Datalabs project is being developed as an Open Source project. This opens up the
opportunity to make use of cloud tooling such as GitHub and Travis and cloud services
such as [Auth0](https://auth0.com/) for authentication and authorisation services.

#### Scalable

One of the main drivers behind Datalabs is to allow users to make easy use of scalable
compute provided by JASMIN. Given this, the Datalabs system needs to be able to take
advantage of the scalable compute.

### System Qualities

| Quality | Note |
|---------|------|
| **Reliability** | |
| **Security** | |
| **Scalability** | |
| **Useability** | |
| **Testability** | |
| **Maintainability** | |
| **Extendability** | |

### Engineering Principles

| Principle | Rational | Architectural impacts |
|-----------|----------|-----------------------|
| **Separation of concerns** ||
| **Horizontal scaling** ||
| **Low coupling** ||
| **Bounded contexts** ||
| **Containerised services** ||
| **Automation** ||
| **12 Factors** ||

### Architectural Styles

| Style | Description |
|-------|-------------|
| **MicroService architecture** |  |
| **Multi-tennancy** |  |
| **Federated authentication** | |

## Platform Context

The Datalabs platform context is [covered here](./02-architecture-context.md)

## View Points & Views

In this document the following
[View Points](https://www.iasaglobal.org/itabok/capability-descriptions/views-and-viewpoints/)
are chosen to describe the architecture:

* [Functional view](./03-architecture-functional.md)
* [Process view](./04-architecture-process.md)
* [Security view](./05-architecture-security.md)
* [Deployment view](./06-architecture-deployment.md)
* [Development view](./07-architecture-development.md)
* [Testing view](./08-architecture-testing.md)

## Architecture Decision Records

We are using ADRs to record decisions with architectural impacts. These can be viewed at
<https://github.com/NERC-CEH/datalab/tree/master/architecture/decisions>
