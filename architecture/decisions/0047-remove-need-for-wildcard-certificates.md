# 47. Remove need for wildcard certificates

Date: 2021-05-13

## Status

Accepted

## Context

DataLabs makes extensive use of reverse proxying, to give users access to resources (such as Minio or JupyterLabs).  These resources need individually from an external URL to an internal service URL.  There are four design options for reverse proxying (<http://sawers.com/blog/reverse-proxying-with-nginx/>):

1. Subdomain - this allows the external path and internal path to be the same, probably with a default root base path (/).  Different services are identified by the external URL's hostname.  This has some disadvantages - multiple hostnames require a wildcard certificate, or multiple certificates if a wildcard certificate can not be acquired; and it makes the development environment more difficult, because you can not just use localhost.
2. Port - this also allows the external path and internal path to be the same, probably with a default root base path (/).  Different services are identified by the external URL's port.  This has the disadvantage that some organisational firewalls restrict http traffic to unusual hosts.
3. Symmetric Path - this allows the external path and internal path to be the same, but with that path configured.  Different services are identified by the path.  This is the best option, but the internal service must allow the path to be configurable.
4. Asymmetric Path - here the external and internal paths are different.  Different services are identifiable by the external path.  This requires a search-and-replace of the path on the rendered HTML and JavaScript, so unless these are simple, then this is too fragile.

Historically DataLabs has used Subdomain proxying.

## Decision

Where possible, Symmetric Path or Asymmetric Path proxying should be used.  If this is not possible, a ConfigMap option should determine whether the remaining proxying strategy should be Subdomain or Port proxying.

## Consequences

* Developer effort is required to develop the different proxying strategies.
* Portability will be improved and local development will be simplified.
