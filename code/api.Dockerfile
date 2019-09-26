FROM node:8.16.0-alpine as common

ARG LIBRARY

RUN mkdir -p /opt/build/${LIBRARY} && mkdir -p /opt/output

WORKDIR /opt/build/${LIBRARY}

COPY ./yarn.lock .
COPY ./workspaces/${LIBRARY}/package.json .

RUN yarn install --slient

COPY ./workspaces/${LIBRARY}/ .

RUN yarn build && rm -rf ./src/ && mv ./dist/ ./src/ && yarn pack && mv *.tgz /opt/output


RUN mkdir -p /opt/build/service-chassis
WORKDIR /opt/build/service-chassis
COPY ./yarn.lock .
COPY ./workspaces/service-chassis/package.json .

RUN yarn install --slient

COPY ./workspaces/service-chassis/ .

RUN yarn build && rm -rf ./src/ && mv ./dist/ ./src/ && yarn pack && mv *.tgz /opt/output


FROM node:8.16.0-alpine

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
