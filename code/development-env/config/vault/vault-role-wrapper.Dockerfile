FROM node:8

LABEL maintainer "joshua.foster@stfc.ac.uk"

RUN apt-get update && \
    apt-get install jq --yes

COPY ./entrypoint.sh /usr/local/bin

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
