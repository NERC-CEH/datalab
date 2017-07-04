FROM node:6.10.3

LABEL maintainer "gareth.lloyd@stfc.ac.uk"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN yarn install --silent --production && yarn cache clean

EXPOSE 8080 8081

CMD [ "yarn", "start" ]
