# 3. Create a Spark Cluster

In this section you will create a Spark cluster, in order to use it in your notebook.

Starting point: you should be logged in to DataLabs, in a project you have admin
permissions for. This project should contain a JupyterLab notebook in which you have
created a Conda environment.

![project page](../../img/project-page.png "project page")

On the left-hand-side, select **Spark**.

![project spark page](../../img/project-spark-page-no-clusters.png "project spark page")

Select **Create cluster**, and fill out a form to create the Spark cluster.

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

![create cluster form](../../img/create-spark-cluster-form.png "create cluster form")

You will then be able to see the cluster that you have created.

![project spark page](../../img/project-spark-page-first-cluster.png "project spark page")
