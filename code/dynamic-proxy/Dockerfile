FROM node:6.10.3

LABEL maintainer "gareth.lloyd@stfc.ac.uk"

# Global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update -qq && \
    apt-get install -y -qq yarn

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn install --silent --production && yarn cache clean
COPY . /usr/src/app

EXPOSE 3000
CMD [ "yarn", "start" ]
