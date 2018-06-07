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
| Scalability | It is anticipated that the data volume will grow over time as the system
continues to add new data sources. It is important that any technologies chosen can
scale horizontally to support large volumes of data. |
| Security | The system being developed is a public facing website which means that
security must be carefully considered in all aspects of the application. Given the
dynamic nature of the system we need to ensure that security is built in to all layers of
the system and implemented to ensure that systems are secure by default. |
| Testability | Given the system will have a large number of different components it is important to ensure that each is independently testable to ensure that developers can work independently. |
| Usability | Given the Datalabs system will be a public facing website, it is important that usability is considered. |
| Maintainability | It is hoped that this system will be continually developed and maintained over a period of time. Given this, it is important that the code is developed to all of the appropriate coding standards and that ease of maintenance is considered during development. For example, deployments should be scripted to ensure that configuring system instance is quick. |

## Engineering Principles

| Principle | Rational | Architectural impacts |
|-----------|----------|-----------------------|
| Separation of concerns | The application should be developed with clear boundaries between different areas of responsibility. This will be driven out by the use of TDD at a low level and by the layered design at a higher level. | The system will use the architectural layering defined for each component. |
| Containerised services | Packaging system artefacts into Docker containers means that services can be easily moved between environments. | A container orchestration platform will be required to operate the containerised services. |
| 12 Factors | The principles described as [12 Factors](https://12factor.net/) provide a good baseline for |
| Use of frameworks and libraries | The use of standard frameworks and libraries, where appropriate, will enable efficient development and ensure that industry best practice is followed. | Where possible, third party libraries and frameworks should be used to facilitate development. They should be carefully evaluated prior to use to ensure that they are under active development, have clear documentation and a large community. |
| Communication via HTTP | The system components will need to communicate with each other to store and retrieve data. This communication should be via HTTP as far as possible for simplicity. | Communication between components must be carefully considered to ensure that the system isn't too 'chatty'. |
| Error handling | The system needs to ensure that unexpected errors do not reveal details of the system’s implementation | Each component will use a consistent approach to error handling. |
| Logging | All components should implement logging appropriate to the components function. | Logging should be considered as a first class concern for all components since they will require different strategies. For example, the back end data collection tools should report status, progress and any errors in a format suitable for either developers of administrators. The website on the other hand should present the users with clear but appropriate error messages while logging detailed failure messages to the server logs.
| Automated deployment | The system will consist of many components and will need to be regularly and easily deployed | All components should be designed to be easily deployed. |

## Architectural Styles

| Style | Description |
|-------|-------------|
| Service architecture | The most appropriate technology for each component will be selected and any functions required by other systems will be exposed via HTTP as services. This is not a microservices architecture since there will only be a handful of different services. |
| Separated presentation | Separated presentation gives separation of concerns in the presentation tier and allows for better testability. |
| Modular architecture | Within each component a modular architecture will be used to ensure that we have clean separation between different areas of responsibility. For example, the data collection code will separate out access to remote systems from database access from data manipulation to allow each to be developed and tested independently. |
| Multi-tennancy | Datalabs is expected to host multiple independent user groups and so should be designed to be a multi-tenant system. Resources should be protected by account/project information as well as user identity. |

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
