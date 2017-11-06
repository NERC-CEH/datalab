# 28. Spark for distributed compute

Date: 2017-11-04

## Status

Accepted

## Context

One of the aims of the Datalabs project is to provide the climate science community easy
access to the compute capabilities of JASMIN. In order to do this we need to find a way
to distribute computationally expensive calculations across a cluster and need to explore
the available options for doing this.

## Decision

We have decided to use [Apache Spark](https://spark.apache.org/) as our first option for
distributed compute. It has established itself as the successor to Hadoop and provides
strong integration with interactive notebook technologies such as Jupyter and Zeppelin.

Spark also provides support for multiple languages including Scala, Java, Python and R.
This makes is a flexible platform that should appeal to many users.

Additionally, Spark provides Streaming and Machine Learning capabilities which may be of
interest later in the project.

## Consequences

We will have access to a distributed compute environment that supports many languages
and will allow us to make better use of the compute power available to us. This
performance improvement over single machine environments will be a key message to
entice users away from their desktops and into the Datalabs environment.

We will need to provide a shared file system to allow datasets to be available to all
nodes.

We will need to ensure that the Spark version built into the Zeppelin containers matches
the version deployed on the cluster.
