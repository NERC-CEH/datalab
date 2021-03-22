# 46. Create Dask clusters within DataLabs

Date: 2021-01-27

## Status

Accepted

## Context

Currently, creating Dask clusters is not ideal:

* The service has create-pod permission which is unwise
* Different projects can currently use each other's clusters, which is poor resource management and could allow algorithm inspection from the Desk scheduler plan
* There is sometimes a requirement to give Dask clusters storage access, to share data or Conda environments.  This is not self-service, and potentially exposes project data since the Dask clusters are not secured by project.
* Dask Gateway was investigated, but does not fit in our authentication model (since it does not use OIDC), and it still provides no straight-forward route to storage access.

## Decision

After prototyping a working solution, we have decided to handle Dask cluster creation within the infrastructure-api service.
This will allow us to securely mount volumes and utilise user-defined Conda environments.

## Consequences

* Developer effort is required to implement Dask clusters within DataLabs.
* Users can securely mount project Data and Conda environments into their Dask clusters.
