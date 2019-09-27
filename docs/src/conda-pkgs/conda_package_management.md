# Adding & Removing Conda Packages

When using Conda within Jupyter, there a number of ways in which packages can be
installed. When using Conda environments however it is important that packages
are installed into the correct environment, hence there are a few recommended
methods listed below.

## Python

Python has native Conda Environment support. Hence from within a notebook using
a specific Kernel simply calling `conda install` will automatically install the
package into the current environment. This can also be desirable in a notebook
to capture package installs for ease of reproducibility for others not working
in the same environment.

## Terminal

Conda packages can be installed from a Terminal session, however before carrying
out the installs environmental variables must be setup to ensure packages are
installed into the correct location, this process is a simple case of running
`source` on the environment directory before proceeding with the installs.

```bash
source activate /data/conda/<environment_name>
conda install -y <package>
```

## R

By default there is no native integration allowing Conda to be used from an R
session, hence it is recommended that the terminal is used to install R
packages. The majority of R packages should be available from the Conda
repositories, however all are prefixed with `r-`, hence to install a package
such as nycflights13, the following input will work.

```bash
source activate /data/conda/<environment_name>
conda install -y r-nycflights13
```
