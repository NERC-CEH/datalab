# Common Issues

Below is a number of common encountered issues and answers with using Dask
within DataLabs.

## Numbers of workers

The number of workers should be chosen carefully in accordance with the
requirements of the analysis. As resources are all shared within the cluster
it's imporant to not create more workers than are required, and to shut them down
when the work is finished to free up the resources for others to use.

If you are finding that the number of workers does not reach the number you
have tried to provision, it's likely that all of the resources in the cluster are
currently being used, hence do not try to add any further workers without contacting
an administrator.

## Python Libraries

Dask workers are provisioned with a number of libraries by default, commonly
however additional packages will be needed as part of the analysis. When using
these non-default libraries, you will need to ensure that they are installed
in all of the worker nodes prior to running the analysis.

This can be done with the following example below, where generally `pip` or `conda`
will be used to install any required packages and dependencies. (Note that before
running this a Dask cluster will have to be spun up and a client defined.)

```python
conda_packages = "zarr numpy"
pip_packages = "xarray"

def install_packages():
    import os
    os.system("conda install %s -c conda-forge -y" % conda_packages)
    os.system("pip install %s" % pip_packages)

client.run(install)
```

It's recommended that this cell is kept within the notebook itself as it will
need to be re-run when the Dask cluster is recreated.
