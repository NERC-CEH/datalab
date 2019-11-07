# Spark job using Data in Object Store

In DataLabs, users can create Spark clusters from the notebooks in
their sessions and submit jobs to them. This page describe how a
user can submit a Spark job using data stored in the Object Storage.

## Prerequisites

The user would need to have first obtained the Object store credentials
from the JASMIN support team. These would be in the form of two
strings - an access key and a secret key. These should be stored securely.

## Create Notebook

Create a Jupyter notebook within your defined project.
When the notebook is created the Spark properties needed
for the Spark cluster to be created is dynamically loaded into the notebook environment.

### Create Spark session and load credentails

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('Cropnet') \
    .config("fs.s3a.access.key", "xxxxxxxxx") \
    .config("fs.s3a.secret.key", "xxxxxxxxxxx") \
    .config("fs.s3a.endpoint", "http://ceh-datalab-U.s3-ext.jc.rl.ac.uk") \
    .config("fs.s3a.path.style.access", True) \
    .config("fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem") \
    .getOrCreate()
```

### Read data from the Object store

```python
df = spark.read.csv('s3a://cropnet-test/crops.csv', inferSchema=True,header=True)
```

### Dispaly the dataframe created

```python
df.show()
```

### Stop the Spark session

```python
spark.stop()
```
