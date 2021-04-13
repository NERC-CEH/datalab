# 2. Getting ready

The Dask workers run Python in a particular environment.
If you do not specify a Conda environment for the Dask cluster,
then it will run in a default environment.
For some situations that will be fine,
but in many situations it is less error-prone if the Dask workers
and the notebook are using the same environments.
This can be achieved by using the same Conda environment in the notebook and the cluster.

This is the approach being taken in this tutorial.
Therefore, before proceeding, ensure that you have:

* a project
* project storage
* a notebook
* a Conda environment

If you are unsure how to create these, then please follow the material in the tutorial
[My first Jupyter project](../getting-started-jupyter/README.md).
