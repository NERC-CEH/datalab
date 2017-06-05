FROM nginx:1.13.0

LABEL maintainer "joshua.foster@stfc.ac.uk"

COPY ./app.nginx.config /etc/nginx/conf.d/default.conf

COPY ./dist/app /usr/share/nginx/html
