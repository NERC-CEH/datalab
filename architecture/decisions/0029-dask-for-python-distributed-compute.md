# 29. Dask for Python distributed compute

Date: 2017-11-05

## Status

Accepted

## Context

Following a meeting with the Met Office it is clear that their Python users were seeing
great success using [Dask](https://dask.pydata.org/en/latest/) as their distributed
compute environment. Dask appears that it could be easier to use than Spark for users
who already know Python and NumPy.

## Decision

We have decided to offer Dask in addition to Spark within the Datalabs platform. This
enables us to appeal to more users at limited cost.

## Consequences

We will have to maintain two distributed compute capabilities.
