# 38. Yarn Workspaces for package management and resolution across services

Date: 2019-08-22

## Status

Accepted

## Context

We are using a mono-repository structure for the Datalabs project, this permits
sharing of components across independent services. In NodeJS sharing of code
without duplication requires linking of modules to the dependant service.

There are a few libraries to manages code-sharing:

* NPM Link
* Yarn Workspaces
* Learna

## Decision

We have decided to use Yarn Workspaces as is very lightweight and offers
management of the links required for module share, including auto discovery of
other services.

We have ruled out using straight NPM Links as they are difficult to set-up and
share between development team. We have used Learna on other project and found
it to be very heavyweight and requires that is adds git commits to releasing new
versions.

## Consequences

We need to restructure our services to work with Yarn Workspaces. This will
require splitting of the Datalabs Web-App, API and Shared module into
independent services. As we are using Babel and ES-Modules rather than straight
NodeJs and CommonJS modules, we will need to add and maintain scripts to handle
the build process.
