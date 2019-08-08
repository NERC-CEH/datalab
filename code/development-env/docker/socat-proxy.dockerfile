FROM alpine

LABEL maintainer "joshua.foster@tessella.com"

RUN apk update && apk add --no-cache socat

ENV SERVER_IP=192.168.99.100
ENV SERVER_PORT=80

CMD ["sh", "-c", "socat TCP-LISTEN:80,fork TCP:${SERVER_IP}:${SERVER_PORT}"]
