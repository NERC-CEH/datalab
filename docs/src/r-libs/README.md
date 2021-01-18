# Managing packages within R

In DataLabs, notebooks and services run as containers using linux based
operating systems. When installing a R libary these packages are compiled and
stored in a global library shared between the notebooks. As this library is
shared packages may be updated, added or remove by other notebook users.

We recommend using **packrat** to manage the packages in a private library for
each project and **devtools** to install specific versions, see [Packrat Quick-
Start Guide](./packrat.md).
