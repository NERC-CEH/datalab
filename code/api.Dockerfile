FROM node:8.16.0-alpine as common

ARG LIBRARY

RUN mkdir -p /opt/build && mkdir -p /opt/output

WORKDIR /opt/build

COPY ./yarn.lock .
COPY ./workspaces/${LIBRARY}/package.json .

RUN yarn install --slient

COPY ./workspaces/${LIBRARY}/ .

RUN yarn build && rm -rf ./src/ && mv ./dist/ ./src/ && yarn pack && mv *.tgz /opt/output


FROM node:8.16.0-alpine

ARG WORKSPACE

LABEL maintainer "joshua.foster@stfc.ac.uk"

RUN mkdir -p /usr/src/{app,common}

WORKDIR /usr/src/app

COPY --from=common /opt/output/ /usr/src/common
COPY ./yarn.lock .
COPY ./workspaces/${WORKSPACE}/package.json .

RUN yarn add /usr/src/common/*.tgz && yarn install --silent --production && yarn cache clean

COPY ./workspaces/${WORKSPACE}/dist .

EXPOSE 8000

CMD ["node", "/dist/app.js"]
