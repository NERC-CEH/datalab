# Dependency management with Packrat

Packrat is a dependency management system for R developed by RStudio. This
provides an isolated, portable and reproducible R environment for each project.
Packrat is included by default in the notebooks offered within Datalabs (Jupyter
and Zeppelin). Below is a quick summary regarding the use of packrat in the
datalabs environment, further information about this package can be found
[here](https://github.com/rstudio/packrat).

## Quick-start guide

### Initialising a new project

To use Packrat to manage the R libraries for a project first set the working
directory and run the `packrat::init` command. This initialisation step is only
required to be run once to set-up a private library to store the libraries
required for the project.

```R
setwd('/data/example_project')
packrat::init()
```

### Opening a Packrat managed project

Once initialised, a project can be opened using the `packrat::on` function. This
will set the private project library for installing and opening of packages. The
default global library can be restored by running the `packrat::off` command.
When using *Spark* the `clean.search.path = FALSE`  argument should be given to
the `on` function, this prevents unloading the `SparkR` library (see [Packrat on
Spark](./packrat_on_spark.md) for more information).

```R
setwd('/data/example_project')
packrat::on()
```

### Installing a package

An `R` package can be installed in the private project library using the base
`install.packages` function. The project lockfile (used to restore libraries)
can then be updated by running `packrat::snapshot`.

```R
install.packages('fortunes')
packrat::snapshot()
```

### Installing a package specific version

Packrat can additionally manage packages installed via the `devtools` library.
This allows for the installation of specific package versions from CRAN and
development versions from GitHub.

```R
# From CRAN
devtools::install_version('zoo', version='1.7-14')
packrat::snapshot()

# From GitHub - userName/repoName@version
devtools::install_github('IRkernel/IRkernel@0.8.8')
packrat::snapshot()
```

### Removing a package

Packaged that are no longer required can be deleted using the `remove.packages`
function, this will remove the package from the private project library. The
project lockfile can then be updated using the `packrat::snapshot` command.

```R
remove.packages('fortunes')
packrat::snapshot()
```

### Restore project packages

The R dependencies managed by packrat are recorded in a lockfile, this includes
details on the source and version of the installed packages. When calling
`packrat::restore` the project library is updated to reflect the lockfile. This
can be used to maintain a exact copy of your working `R` set-up and can be
included with version control.

This functionality is especially useful within DataLabs when using a project on
an alternative notebook type or when needing a library within *Spark*. For more
information see [Packrat on Spark](./packrat_on_spark.md).

```R
packrat::restore()
```
