FROM node:16.10-buster-slim

RUN apt-get update

ENV APP_ROOT /app

WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}

RUN npm ci
RUN npm run build

ENV HOST 0.0.0.0