# 1. What is a Spark cluster?

**Spark** is a unified analytics engine for large-scale data processing which can be used
in both Python and R.

A **Spark cluster** consists of:

* A **scheduler**: this is responsible for deciding how to perform your calculation.
It subdivides the work into chunks
and co-ordinates how those chunks are performed across a number of *workers*.
* A number of **workers**.  Workers perform the chunks of calculation that they have been allocated.

In your lab notebook, you will start a Spark **context** or **session**.
This is what lets your notebook talk to the scheduler of
the Spark cluster, telling the scheduler what calculation you want to perform.

Further reading:

* Spark: <https://spark.apache.org/docs/latest/>
* Spark examples: <https://spark.apache.org/examples.html>
