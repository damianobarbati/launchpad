FROM node:22.1-alpine AS base

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"

ARG VITE_GIT_HASH_VERSION
ENV VITE_GIT_HASH_VERSION=$VITE_GIT_HASH_VERSION
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_APP_ENV
ENV VITE_APP_ENV=$VITE_APP_ENV
ARG VITE_VAPID_PUBLIC_KEY
ENV VITE_VAPID_PUBLIC_KEY=$VITE_VAPID_PUBLIC_KEY
ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

FROM base AS build
COPY . /mnt
WORKDIR /mnt

RUN apk add --no-cache --update --upgrade --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false --frozen-lockfile --prefer-offline

RUN pnpm run -r build
RUN pnpm deploy --filter=admin --prod /tmp/admin

FROM base AS admin
RUN apk add --no-cache --update --upgrade --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community pnpm
COPY --from=build /tmp/admin /tmp/admin
WORKDIR /tmp/admin
CMD pnpm -F admin serve
