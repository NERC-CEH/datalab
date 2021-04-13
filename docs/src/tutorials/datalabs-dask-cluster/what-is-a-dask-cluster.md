# 1. What is a Dask cluster?

**Dask** is a flexible library for parallel computing in Python.
It works at the scale of a single laptop, enabling parallel processing and extending the
size of convenient datasets from "fits in memory" to "fits on disk".

However, it can also work across a cluster of multiple machines.
This is probably how you will use it on DataLabs, utilising the compute power of DataLabs.

A **Dask cluster** consists of:

* A **scheduler**: this is responsible for deciding how to perform your calculation.
It subdivides the work into chunks
and co-ordinates how those chunks are performed across a number of *workers*.
* A number of **workers**.  Workers perform the chunks of calculation that they have been allocated.

In your lab notebook, you will start:

* A Dask **client**: this is what lets your notebook talk to the scheduler of the Dask cluster,
telling the scheduler what calculation you want to perform.
* A Dask **dashboard** which will give you an indication
of how your work is being chunked up, and how your cluster is being utilised.

Further reading:

* Dask: <https://docs.dask.org/en/latest/>
* Dask clusters: <https://distributed.dask.org/en/latest/>
* Dask dashboard: <https://docs.dask.org/en/latest/diagnostics-distributed.html>
