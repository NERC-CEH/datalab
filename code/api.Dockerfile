# Build library dependencies
FROM node:20.14-alpine as common

ARG LIBRARY

RUN mkdir -p /opt/build && mkdir -p /opt/output

WORKDIR /opt/build

COPY ./yarn.lock .
COPY ./babel.config.js .
COPY ./workspaces .
COPY ./docker/buildLibraries .

RUN ./buildLibraries

# Build the service container
FROM node:20.14-alpine 

ARG WORKSPACE

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
# fix for multiple COPY errors, see https://github.com/moby/moby/issues/37965
RUN true
COPY ./version.json .

EXPOSE 8000

CMD ["node", "server.js"]
