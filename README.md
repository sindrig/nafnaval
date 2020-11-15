# Nafnaval.is

![CI/CD](https://github.com/sindrig/nafnaval/workflows/CI/CD/badge.svg)

A free service for soon-to-be parents that need to select valid Icelandic names for their newborns.

## Development

Start your local backend:

    make local-env

A production build will be available at [localhost:8080](http://localhost:8080).

You can of course run the front-end:

    cd frontend
    yarn start

## Deploying manually

    make target=staging deploy
    make target=prod deploy