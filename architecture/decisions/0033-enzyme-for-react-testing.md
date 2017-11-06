# 33. Enzyme for React testing

Date: 2017-11-05

## Status

Accepted

## Context

We need to choose a rendering library to allow testing of React components.

## Decision

We have chosen to use [Enzyme](https://github.com/airbnb/enzyme) to provide a library
for shallow rendering.

## Consequences

Testing of front end components will be simplified.

We will need to integrate Enzyme rendering into the Jest snapshot rendering framework
in order to be able to use it.
