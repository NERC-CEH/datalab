# Package management on Spark with Packrat

Apache Spark is a distributed compute framework which runs numerous tasks in parallel
across several worker nodes. Within DataLabs we have used Spark to solve large
compute problems using the `R` language.

We have installed `devtools` and `packrat` on the worker nodes to enable
management of packages on a project-by-project basis.

## Using Packrat on the Spark cluster

### Prerequisites

Firstly, initialise the project using Packrat (`packrat::init`) then install the
required packages and finally update the lockfile with `packrat::snapshot`, see
[Packrat Quick-Start Guide](./packrat.md).

### Opening a project in a notebook with a Spark context

With using `R` in a Zeppelin notebook or a Jupyer notebook using `R (SparkR)`
kernel the Spark context has been automatically generated and the `SparkR`
loaded. To prevent Packrat from unloading this library the project must be
opened using the `clean.search.path = FALSE` argument.

```R
setwd('/data/example_project')
packrat::on(clean.search.path = FALSE)
```

### Install R packages in a function running on spark

In DataLabs, the `/data` directory is shared between the Spark worker nodes and
the notebooks. Running `packrat::restore` will compiled and install any missing
packages from the lockfile. These packages are stored within the private project library,
therefore should only need to be build once as it is a shared directory.

```R
sparkFunct <- function(idx) {
    # Open project
    setwd('/data/example-project')
    packrat::on(clean.search.path = FALSE)

    # Install if needed
    packrat::restore()

    # Run code on cluster
    library(fortunes)
    return(fortune())
}

spark.lapply(seq(4), sparkFunct)
```

In a multi-node cluster, it is possible the that many node will race to build
the same package in an identical location, to prevent this run the spark
function once (using a sequence of length 1) before running it with a
larger sequence.
