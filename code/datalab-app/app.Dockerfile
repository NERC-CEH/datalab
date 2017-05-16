FROM nginx:1.13.0

LABEL maintainer "joshua.foster@stfc.ac.uk"

COPY ./dist/app /usr/share/nginx/html
