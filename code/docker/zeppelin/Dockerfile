FROM  alpine:3.6
LABEL maintainer "gareth.lloyd@stfc.ac.uk"

ARG DIST_MIRROR=http://archive.apache.org/dist/zeppelin
ARG VERSION=0.7.1
ENV ZEPPELIN_HOME=/opt/zeppelin \
    JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk \
    PATH=$PATH:/usr/lib/jvm/java-1.8-openjdk/jre/bin:/usr/lib/jvm/java-1.8-openjdk/bin

RUN apk update && apk add --upgrade bash curl jq openjdk8 && \
    mkdir -p ${ZEPPELIN_HOME} && \
    curl ${DIST_MIRROR}/zeppelin-${VERSION}/zeppelin-${VERSION}-bin-all.tgz | tar xvz -C ${ZEPPELIN_HOME} && \
    mv ${ZEPPELIN_HOME}/zeppelin-${VERSION}-bin-all/* ${ZEPPELIN_HOME} && \
    rm -rf ${ZEPPELIN_HOME}/zeppelin-${VERSION}-bin-all && \
    rm -rf *.tgz && \
    rm -rf /var/cache/apk/*

EXPOSE 8080 8443

VOLUME ${ZEPPELIN_HOME}/logs \
       ${ZEPPELIN_HOME}/notebook

WORKDIR ${ZEPPELIN_HOME}
CMD ./bin/zeppelin.sh run
