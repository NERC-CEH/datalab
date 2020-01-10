# Basic Spark job

In DataLabs, users can create Spark clusters from the notebooks in
their sessions and submit jobs to them.

## Create Notebook

Create a Jupyter notebook within your defined project.
When the notebook is created the Spark properties needed
for the Spark cluster to be created is dynamically loaded into the notebook environment.

### Set env variable

```python
import os
os.environ['PYSPARK_PYTHON'] = '/usr/bin/python3'
```

### Create Spark session

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('Test').getOrCreate()
```

### Sample Spark code

```python
rdd = spark.sparkContext.parallelize(range(10000000))
rdd.sum()
```

### Stop the Spark session

```python
spark.stop()
```
