FROM node:22.1-alpine

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"

ARG GIT_HASH_VERSION
ENV GIT_HASH_VERSION=$GIT_HASH_VERSION

COPY . /mnt
WORKDIR /mnt

RUN apk add --no-cache --update --upgrade --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community pnpm dumb-init
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false --frozen-lockfile --prefer-offline
RUN chown -R node:node /usr/bin/pnpm

USER node
CMD dumb-init pnpm -F api start
