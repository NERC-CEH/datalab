# 3. Ubuntu 16.04 as Server OS

Date: 2017-11-04

## Status

Accepted

## Context

We need to select a base operating system to install on all virtual machines that form
the Datalabs environment. There are three choices available through the JASIMN portal
Ubuntu 14.04, Ubuntu 16.04 and CentOS 6.9.

## Decision

We have selected Ubuntu 16.04 as the base operating system for our servers for several
reasons:

* The team are more familiar with Ubuntu over CentOS.
* Packages are likely to be more easily available on Ubuntu.
* CentOS 6.9 is no longer being updated (last update 10/5/2017).
* Ubuntu 16.04 will be supported for far longer. 14.04 end of life is early 2019.

## Consequences

The main consequence of this decision is that the development workstations are running
CentOS 7 rather than Ubuntu so we will see differences between the environments. This is
not expected to be a significant issue as we have plenty of JASMIN resource available to
create test servers as required and expect that most of the deployed software will be
containerised allowing easy testing on development machines.
