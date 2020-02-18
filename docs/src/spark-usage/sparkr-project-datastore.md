# SparkR with Project Datastore

This is documentation on how users can create Spark clusters from
within R sessions in Jupyter notebooks and submit jobs to them using the project datastore.

## Create Notebook, Conda Environment and Select R Kernel

Create a Jupyter notebook within your defined project.
When the notebook is created the Spark properties needed
for the Spark cluster to be created is dynamically loaded into the notebook environment.
Install a conda enviroment using <https://datalab-docs.datalabs.ceh.ac.uk/conda-pkgs/conda_environments.html>
and select the R kernel.

### Create Spark session

```R
install.packages("SparkR")
library(SparkR, lib.loc = file.path(Sys.getenv('SPARK_HOME'), "R", "lib"))
sparkR.session(appname = "SparkR-Test",
               sparkHome = Sys.getenv("SPARK_HOME"),
               sparkConfig = list(spark.executor.instances = "6",
                                  spark.kubernetes.container.image = "nerc/sparkr-k8s:latest"))
```

### Read data from project datastore

```R
df <- read.df('cities.csv', header=True)
```

### Dispaly the dataframe created

```R
head(df)
```

### Stop the Spark session

```R
sparkR.session.stop()
```
