# 3. Create a Dask Cluster

In this section you will create a Dask cluster, in order to use it in your notebook.

Starting point: you should be logged in to DataLabs, in a project you have admin
permissions for.

![project page](../../img/project-page.png "project page")

On the left-hand-side, select **Dask**.

![project dask page](../../img/project-dask-page-no-clusters.png "project dask page")

Select **Create cluster**, and fill out a form to create the Dask cluster.

Note that determining the optimum values for **Maximum number of workers**,
**Maximum worker memory**
and **Maximum worker CPU use** may require some trial-and-error.
If you are simply exploring functionality,
it is best to drop these parameters to their minimum values.
DataLabs will reserve the memory and CPU for each worker
(making those resources unavailable for other users),
and will scale the number of workers up from 1 to the maximum (and back down again)
depending on the load on the cluster.

Then select **Create**.

![create cluster form](../../img/create-cluster-form.png "create cluster form")

You will then be able to see the cluster that you have created.

![project storage page](../../img/project-storage-page-first-storage.png "project storage page")
