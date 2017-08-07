FROM node:8.2.1-alpine

LABEL maintainer "joshua.foster@stfc.ac.uk"

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY ./dist/api /usr/src/api

COPY ./package.json /usr/src/api

RUN yarn install --silent --production && yarn cache clean

EXPOSE 8000

CMD ["node", "server.js"]
