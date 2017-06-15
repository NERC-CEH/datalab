FROM java:openjdk-8-jdk

LABEL maintainer "gareth.lloyd@stfc.ac.uk"

ENV ZEPPELIN_VER 0.7.1

RUN mkdir -p /opt

#ADD http://archive.apache.org/dist/zeppelin/zeppelin-${ZEPPELIN_VER}/zeppelin-${ZEPPELIN_VER}-bin-all.tgz
ADD zeppelin-${ZEPPELIN_VER}-bin-all.tgz /opt
RUN ln -s /opt/zeppelin-${ZEPPELIN_VER}-bin-all /opt/zeppelin

ENV ZEPPELIN_HOME=/opt/zeppelin

# Add R-core for use with SparkR (stable: R version 3.1.1, backport: newer: 3.3.3)
RUN apt-get update
RUN apt-get -y -t jessie-backports install "r-base"

# Add KnitR for R html rendering with Zeppelin
RUN R -e "install.packages('knitr', repo='https://cloud.r-project.org/')"

EXPOSE 8080 8443

VOLUME ${ZEPPELIN_HOME}/logs \
       ${ZEPPELIN_HOME}/notebook

WORKDIR ${ZEPPELIN_HOME}
CMD ./bin/zeppelin.sh run
