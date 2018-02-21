FROM mongo:3.5

LABEL maintainer "gareth.lloyd@stfc.ac.uk"

COPY ./import.sh /usr/local/bin

RUN chmod +x /usr/local/bin/import.sh

CMD import.sh
