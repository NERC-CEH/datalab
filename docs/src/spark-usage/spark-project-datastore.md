# Spark job with local master

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
spark = SparkSession.builder.master('local').appName('Test').getOrCreate()
```

### Read data from project datastore

```python
df = spark.read.csv('cities.csv', header=True)
```

### Dispaly the dataframe created

```python
df.show()
```

### Stop the Spark session

```python
spark.stop()
```
