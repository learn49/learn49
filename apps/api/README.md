<p align="center">
  <img src="learn49.png" />
</p>

# Learn49-API

Create a `.env` file based on `.env.example` and fill with your current settings (for database, and other keys).

## Running migrations

```
yarn migration:run
```

## To create new migration

```
 yarn migration:new -- <name>
```

## Run server in development

```
npm run start:dev
```

## By-pass recaptcha validation

Set the `RECAPTCHA_KEY` to `--bypass--`.

```
RECAPTCHA_KEY=--bypass--
```

## Configuring sentry

Set the `SENTRY_DSN` to your previously account on Sentry.io created.

```
SENTRY_DSN='https://your-url.sentry.io/'
```

## Creating initial account

In order to use the api locally, we map `localhost` to `learn49` subdomain.

To create a new account with this values, use this mutation:

```graphql
mutation {
  createAccount(
    input: {
      subdomain: "learn49"
      email: "owner@learn49.com"
      passwd: "abcd1234"
      recaptcha: ""
    }
  ) {
    id
  }
}
```

In order to use the api locally, we map `127.0.0.1` to `learn50` subdomain.

```graphql
mutation {
  createAccount(
    input: {
      subdomain: "learn50"
      email: "owner@learn50.com"
      passwd: "abcd1234"
      recaptcha: ""
    }
  ) {
    id
  }
}
```

## Storage settings for dev

```
BUCKET=
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=
```

## Command to create Docker Container Postgres

```
docker run --name learn49-postgres -d -it -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=learn49-test -p 5432:5432 postgres
```

## Errors on Windows

```
 error TS1259: Module '.../node_modules/@types/ws/index"' can only be default-imported using the 'esModuleInterop' flag

5 import WebSocket from 'ws';
```

To Fix: add on tsconfig.json

```
"allowSyntheticDefaultImports": true
```

| query/mutation             | public | owner | teacher | student |
| -------------------------- | :----: | :---: | :-----: | :-----: |
| createAccount              |   ✔️   |   -   |    -    |    -    |
| updateAccount              |   -    |  ✔️   |    -    |    -    |
| getAccountSettingsByDomain |   ✔️   |   -   |    -    |    -    |

## Notes to ourselves:

- Consider moving roles to AuthGuards: ref: https://docs.nestjs.com/guards#setting-roles-per-handler

## Description

Based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

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
