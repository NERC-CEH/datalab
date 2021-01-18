# Dependency management with Conda on Jupyter

When using Datalabs the recommended way to install packages is through use of
Conda. This is a flexible package/library management tool that can be used to
install dependencies across multiple languages and platforms (for more
information see <https://docs.conda.io/en/latest/>).

One of the key advantages of Conda is allowing dependencies (including, but not
limited packages, binaries & libraries) to be captured alongside project code.
It is the default package manager for Jupyter Notebooks. [Conda
Environments](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)
utilize Conda to allow users to setup isolated sets of dependencies. This offers
numerous advantages, but practically for DataLabs this allows dependencies to be
used within multiple notebooks and persisted when notebooks are rescheduled
across the [Kubernetes cluster](https://kubernetes.io/docs/home/).

## Quick-start guide

In order for Conda environments to be persisted within DataLabs, they must be
stored on the `/data` mount point which is shared among notebooks of the same
project. Some wrapper commands have been written to make this easier, but users
are free to look at [Conda
Documentation](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html)
themselves.

### Initialising a new project

A Conda environment can be setup by opening a Jupyter notebook/lab and from the
terminal running the following command.

```bash
env-control add new-environment
```

This will trigger the creation of a Conda environment as well as adding Jupyter
Kernels for both R & Python by default which are persisted on the data volume.
When running this for a brand new environment this is likely to take ~10 minutes
as it installs a number of dependencies, however this will rarely be required.

Once the command is complete, refresh the page and from the `Launcher`, two new
kernels will be visible which correspond to the newly created Conda environment.
There is a corresponding command;

```bash
env-control del environment-name
```

This will remove a Conda environment called `environment-name`, and is useful in
clearing down environments which are no longer required.
