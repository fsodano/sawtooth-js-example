FROM node:8.1.3-alpine

RUN mkdir -p /var/www
WORKDIR /var/www

COPY . .

RUN npm install -g -s --no-progress yarn

RUN apk add --no-cache --virtual build-dependencies make gcc g++ python && \
apk add --no-cache krb5-dev zeromq-dev && yarn global add node-gyp

RUN yarn install --dev
