# 27. Thredds to serve NetCDF data

Date: 2017-11-04

## Status

Accepted

## Context

The NOC use case requires access to a large (~1TB) NetCDF dataset currently stored on the
ARCHER system. The current usage requires data to be extracted using shell scripts and
this process takes a long time. We need to identify a better way to access this
dataset to allow the Datalabs environment to make best use of it.

## Decision

We have decided to use a [Thredds](http://www.unidata.ucar.edu/software/thredds/current/tds/)
server to present a unified view of the dataset as it should provide significant
performance improvements over manual scripting.

In order to achieve this, we need the data to be moved to a JASMIN Group Workspace (GWS)
to allow us to provision a Thredds server in the JASMIN managed cloud.

## Consequences

We will have better access to the NOC waves dataset and will be able to use it from the
Datalabs environment.

We will identify what the performance gains (if any) are over the current access method.

We will have duplicated the waves dataset into the JASMIN environment and this may cause
long term management issues, particularly in ensuring the monthly updates are applied.
