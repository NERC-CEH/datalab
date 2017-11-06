FROM node:8.2.1-alpine

LABEL maintainer "gareth.lloyd@stfc.ac.uk"

RUN mkdir -p /usr/src/api

COPY ./package.json /usr/src/api

WORKDIR /usr/src/api

RUN yarn install --silent --production && yarn cache clean

COPY ./dist /usr/src/api

EXPOSE 8000

CMD ["node", "server.js"]
