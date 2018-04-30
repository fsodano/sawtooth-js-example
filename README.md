# sawtooth-js-example
An implementation of sawtooth's XO Transaction Processor in JavaScript, including a Vue.JS client.

<img width="702" alt="screenshot 2018-04-30 11 05 41" src="https://user-images.githubusercontent.com/844181/39412943-a7bbca76-4c66-11e8-96ff-3c8a0196e8f0.png">

# Installation

Run `docker-compose up -d` to get the systems up and running.
Run `yarn install` to install all dependencies.

## Transaction Processors

TPs will run on docker containers.

A note on the `Dockerfile` included: You can use it as a base to run other custom built TPs in node.

### xo-processor

The TP will run on a docker container, if you wish to run more TPs locally, you can do it by executing:

`yarn start-xo http://localhost:4004`

`http://localhost:4004` is the address of the validator in this example (defined in `docker-compose.yml`)


### hello-processor
Small transaction processor included as a minimal example.

It will also run on a docker container, but if you with to attach another one, you can do so by running:

`yarn start-hello http://localhost:4004` 

`http://localhost:4004` is the address of the validator in this example (defined in `docker-compose.yml`)

## Client

`/cli` contains a Vue.js app that interacts with hyperledger via API.
According to Sawtooth, the `rest-api` they provide does not allow CORS. In order to solve this, there's a small `proxy`
application included in this project.

### Running the proxy
`yarn proxy`

### Running the app
`yarn dev`
