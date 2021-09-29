# Perform Spark Calculation (R)

In this section you will perform a Spark calculation using R.

Starting point: you should be logged in to Datalabs,
with a JupyterLab R notebook connected to a Spark cluster.

The below example is some code that estimates Pi by randomly picking points
inside the unit square.
The proportion of those points that are also inside the unit circle is approximately pi/4.

Copy and paste the following into the next cell:

```python
inside <- function(p) {
  x <- runif(1)
  y <- runif(1)
  return(x*x + y*y < 1)
}

NUM_SAMPLES <- 100
l <- spark.lapply(seq(0, NUM_SAMPLES-1), inside)
count <- length(Filter(isTRUE, l))
pi <- (4 * count) / NUM_SAMPLES
sprintf(fmt="Pi is roughly %f", pi)
```

![jupyterlab spark python calculation](../../img/jupyterlab-spark-r-calculation-done.png
"jupyterlab spark python calculation")

To clear up resources, you can run the following to stop the session:

```r
sparkR.stop()
```
