# Creating a Cluster

There are two options for creating a Dask cluster from within JupyterLab that
are listed below.

**NOTE: Since the resources used are shared among all users of the platform,
when finished with the current activity Dask Workers should be should be shut
down.**

## JupyterLab Dask Extension

The recommended way to create a cluster is to use the JupyterLab interface to
create a new cluster. This is done simply by selecting the Dask icon in the
left hand sidebar and selecting `+NEW`. This may take a few seconds to
initialize and should result in a cluster appearing in the `Clusters` screen
which is titled something like `KubeCluster 1`.

At this point the Dask scheduler will be setup but no workers will be present,
these are added by selecting `SCALE` and choosing a worker count. Once the
worker count is selected it may take up to a minute for all of the workers to
register correctly, at this point (with a notebook open), selecting the `<>`
icon will generate and insert python code to create a client to access the Dask
cluster.

When finished with current work, the workers can be deleted by selecting
`SHUTDOWN`.

## Manual Setup (Advanced)

Instead of using the Dask JupyerLab extension which uses a number of standard
defaults to create a Dask cluster, the same operation can be done manually.
Configuaration for this is slightly more complex but allows for a greater degree
of control, including choice of a default docker image that the Dask workers use
as well as setting custom environmental variables.

The documentation for this can be found [here](https://kubernetes.dask.org/en/latest/).
One thing to note within DataLabs is that when creating a custom `worker-spec.yml`
as per the examples, an additional field must be added to ensure that workers are
provisioned correctly within the cluster, this is `namespace:
${PROJECT_KEY}-compute` where PROJECT_KEY is the name of the current DataLabs
project. This can be found below in an example configuration.

```yaml
kind: Pod
metadata:
  // This line must be added in order for workers to be created
  namespace: testproject-compute
spec:
  restartPolicy: Never
  containers:
  - image: daskdev/dask:latest
    imagePullPolicy: IfNotPresent
    args:
    - dask-worker
    - --nthreads
    - '2'
    - --no-bokeh
    - --memory-limit
    - 4GB
    - --death-timeout
    - '60'
    name: dask
    env:
      - name: EXTRA_PIP_PACKAGES
        value: xarray zarr
    resources:
      limits:
        cpu: "2"
        memory: 4G
      requests:
        cpu: "2"
        memory: 4G
```
