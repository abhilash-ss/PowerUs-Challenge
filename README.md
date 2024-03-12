## Description

This Poject is service in NodeJS with the NestJS framework.

*Note: This project is initialized using the [nestjs typescript starter kit](https://github.com/nestjs/typescript-starter.git)*



## Installation

```bash
$ npm install
```

## Running the app

Before running the app you need to create a `.env` file with the required environment variables. You can use the `.env.sample` as an example or you can copy that to a `.env` file

```bash
# The below command will create a .env file with the sample variable values from .env.smaple
$ cp .env.sample .env
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## How to test the endpoint locally

```bash
# curl to test the endpoint
$ curl --location 'localhost:3000/flights'
```


Note: So far this endpoint returns only the merged responses of External APIs. I didn't add any query phrases (something like origin, destination, date, etc.) to make the endpoint return only the specific results related to the user search. I wasn't sure about that if it required as part of this assignment. Also, I noticed that the external APIs are returning only for specific original and destination trips.