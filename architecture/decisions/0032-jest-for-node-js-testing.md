# 32. Jest for node.js testing

Date: 2017-11-05

## Status

Accepted

## Context

We need to select a testing framework to use for testing node.js applications. There are
many choices in this space including [Jasmine](https://jasmine.github.io/) and
[Jest](https://facebook.github.io/jest/).

## Decision

We have decided to use Jest as our testing framework as it provides mocking and
expectation functions which would have to be provided separately to Jasmine. Additionally
the snapshot testing mechanism can be used to simplify certain types of testing and is
particularly beneficial to front end unit testing.

## Consequences

We will have a consistent testing framework for all JavaScript projects.
