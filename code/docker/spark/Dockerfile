FROM java:openjdk-8-jdk

LABEL maintainer "gareth.lloyd@stfc.ac.uk"

ENV SPARK_VER 2.1.0
ENV HADOOP_VER 2.7

RUN mkdir -p /opt

#ADD http://mirror.ox.ac.uk/sites/rsync.apache.org/spark/spark-${SPARK_VER}/spark-${SPARK_VER}-bin-hadoop2.7.tgz
ADD spark-${SPARK_VER}-bin-hadoop${HADOOP_VER}.tgz /opt
RUN ln -s /opt/spark-${SPARK_VER}-bin-hadoop${HADOOP_VER} /opt/spark

ADD start.sh /usr/local/bin

ENV PATH $PATH:/opt/spark/bin
ENV SPARK_NO_DAEMONIZE 1

# Add R-core for use with SparkR (stable: R version 3.1.1, backport: newer: 3.3.3)
RUN apt-get update
RUN apt-get -y -t jessie-backports install "r-base"

# Patch SparkR to fix issue -- https://issues.apache.org/jira/browse/SPARK-21093
ADD daemon.R.patch /opt/spark/R/lib/SparkR/worker
RUN patch -b /opt/spark/R/lib/SparkR/worker/daemon.R /opt/spark/R/lib/SparkR/worker/daemon.R.patch

# # Expose ports for monitoring.
# # SparkContext web UI on 4040 -- only available for the duration of the application.
# # Spark master’s web UI on 8080.
# # Spark worker web UI on 8081.
EXPOSE 4040 7077 8080 8081

CMD ["/usr/local/bin/start.sh"]
