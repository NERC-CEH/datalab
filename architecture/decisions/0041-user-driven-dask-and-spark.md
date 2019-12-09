# 41. User Driven Dask and Spark

Date: 2019-12-05

## Status

Accepted

Supercedes [28. Spark for Distributed Compute](0028-spark-for-distributed-compute.md)

Supercedes [29. Dask for Python Distributed Compute](0029-dask-for-python-distributed-compute.md)

## Context

Previously we have provisioned centralised Dask & Spark clusters which users can consume
from notebook environments. However since this decision a number of other options
have emerged, specifically being able to use the native Kubernetes scheduler as Dask & Spark
schedulers.

We are now moving to a pattern of users being able to spin up their own clusters
when required.

## Decision

We have decided to collapse the centralised Dask & Spark clusters in favour of writing
documentation/working with users to provision their own clusters using projects such
as [Dask Labextension](https://github.com/dask/dask-labextension), which is now supported
within the Labs environment.

## Consequences

We will provide first class support for the libraries that are required to spin up Dask
and Spark clusters from within DataLabs, and decomission the centralised instances of each.

We will need to write documentation and educate the user community in how clusters can
be provisioned and capacity usage.

We will need to monitor usage of the cluster more closely to ensure that users do not
use excessive resources.
