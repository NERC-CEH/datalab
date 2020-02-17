# SparkR with Object Store

This page describe how users can create Spark clusters from
R sessions and submit jobs to them using data in the Object Store

## Prerequisites

The user would need to have first obtained the Object store credentials
from the JASMIN support team. These would be in the form of two
strings - an access key and a secret key. These should be stored securely.

### Create Notebook, Conda Environment and Select R Kernel

Create a Jupyter notebook within your defined project.
When the notebook is created the Spark properties needed
for the Spark cluster to be created is dynamically loaded into the notebook environment.
Install a conda enviroment using <https://datalab-docs.datalabs.ceh.ac.uk/conda-pkgs/conda_environments.html>
and select the Rkernel

### Set Object Store Credentials in the environment

```R
Sys.setenv(ACCESS_KEY = "xxxxxxx")
Sys.setenv(SECRET_KEY = "xxxxxxxxx")
```

### Create Spark session

```R
install.packages("SparkR")
library(SparkR, lib.loc = file.path(Sys.getenv('SPARK_HOME'), "R", "lib"))
sparkR.session(appName = "SparkR-Test",
               sparkHome = Sys.getenv("SPARK_HOME"),
               sparkConfig = list(spark.executor.instances = "2",
                                  spark.kubernetes.container.image = "nerc/sparkr-k8s:latest",
                                  fs.s3a.access.key = Sys.getenv("ACCESS_KEY"),
                                  fs.s3a.secret.key = Sys.getenv("SECRET_KEY"),
                                  fs.s3a.endpoint = "http://ceh-datalab-U.s3-ext.jc.rl.ac.uk",
                                  fs.s3a.path.style.access = "True",
                                  fs.s3a.impl = "org.apache.hadoop.fs.s3a.S3AFileSystem"))
```

### Read data from the Object store

```R
df <- read.df('s3a://spark-test/cities.csv', "csv", header = "true", inferSchema = "true",\
na.strings = "NA")
```

### Dispaly the dataframe created

```R
head(df)
```

### Stop the Spark session

```R
sparkR.session.stop()
```
