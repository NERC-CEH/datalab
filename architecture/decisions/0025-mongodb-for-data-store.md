# 25. MongoDB for data store

Date: 2017-11-04

## Status

Accepted

## Context

We need to store persistent data in a form that is easy to query and need to select the
appropriate data store. We consider the choice to be between a relational database or a
document database.

## Decision

We have decided to use [MongoDB](https://www.mongodb.com/) as our database for datalabs
data. We felt that the data model for the parts of the system known at this time, a
document structure provided more flexibility and easier integration with our Node.js
application.

MongoDB also provides the ability to run in cluster providing the option for greater
resilience. For the time being we are opting to run a single node storing data to
a mounted GlusterFS volume. This gives data resilience through node failure but obviously
does not give service resilience or time based backups.

## Consequences

We can provide an easy to use data store across all of our applications.

We have opted to use a data store that does not provide referential integrity and will
need to ensure this through the application layer.
