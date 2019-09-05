FROM nginx:1.17.2

ARG WORKSPACE

LABEL maintainer "joshua.foster@stfc.ac.uk"

COPY ./app.nginx.config /etc/nginx/conf.d/default.conf

COPY ./workspaces/${WORKSPACE}/dist /usr/share/nginx/html

COPY ./version.json /usr/share/nginx/html/version.json
