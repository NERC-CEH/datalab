# 21. Use Create React App

Date: 2017-11-04

## Status

Accepted

## Context

We need to decide whether to configure our web application code base ourselves or make
use of the [Create React App](https://github.com/facebookincubator/create-react-app)
to provide project configuration.

## Decision

We have decided to use the Create React App project to provide the base for our React
project as this brings best practice configuration and build and is actively being
developed.

## Consequences

By choosing to use the create react app project we will be able to create the basis
for the project and build much faster than if we do it ourselves.

We may find that we reach a point where find ourselves constrained by not owning the
build script. There is limited risk in this as create react app provides the option to
eject at any point.
