FROM node:8.2.1-alpine

LABEL maintainer "joshua.foster@stfc.ac.uk"

RUN mkdir -p /usr/src/api

COPY ./package.json /usr/src

WORKDIR /usr/src

RUN yarn install --silent --production && yarn cache clean

COPY ./dist/api /usr/src/api

COPY ./dist/shared /usr/src/shared

EXPOSE 8000

CMD ["node", "api/api.js"]
