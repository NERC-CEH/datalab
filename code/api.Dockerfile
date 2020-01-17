# Build library dependencies
FROM node:lts-alpine as common

ARG LIBRARY

RUN mkdir -p /opt/build && mkdir -p /opt/output

WORKDIR /opt/build

COPY ./yarn.lock .
COPY ./babel.config.js .
COPY ./workspaces .
COPY ./docker/buildLibraries .

RUN ./buildLibraries

# Build the service container
FROM node:lts-alpine

ARG WORKSPACE

LABEL maintainer "joshua.foster@stfc.ac.uk"

RUN mkdir -p /usr/src/app/resources && mkdir -p /usr/src/common

WORKDIR /usr/src/common
COPY --from=common /opt/output/ /usr/src/common
RUN yarn add /usr/src/common/*.tgz

WORKDIR /usr/src/app
COPY ./yarn.lock .
COPY ./workspaces/${WORKSPACE}/package.json .

RUN yarn install --prefer-offline --silent --production && yarn cache clean

COPY ./workspaces/${WORKSPACE}/dist .
COPY ./workspaces/${WORKSPACE}/resources ./resources
COPY ./version.json .

EXPOSE 8000

CMD ["node", "server.js"]
