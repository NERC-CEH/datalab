FROM alpine

LABEL maintainer "joshua.foster@tessella.com"

RUN apk update && apk add --no-cache socat

ENV MINIKUBE_IP=192.168.99.100
ENV INGRESS_PORT=80

CMD ["sh", "-c", "socat TCP-LISTEN:80,fork TCP:${MINIKUBE_IP}:${INGRESS_PORT}"]
