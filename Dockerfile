# docker run -it node:8.12-alpine /bin/bash
# ---- Base Node ----
FROM node:10.16-alpine AS base
# Preparing
RUN mkdir -p /var/app && chown -R node /var/app
# Set working directory
WORKDIR /var/app

#
# ---- Dependencies (with packages) ----
FROM base AS dependencies
RUN apk add --update python build-base
# Copy project file
COPY package.json .
COPY yarn.lock .
# Copy packages
COPY packages/assets packages/assets
COPY packages/common packages/common
COPY packages/components packages/components
COPY packages/containers packages/containers
# Resolve package dependencies
RUN yarn

#
# ---- Test & Build ----
# run linters, setup and tests
FROM dependencies AS build_web_app
COPY packages/web-app packages/web-app
# Resolve the web-app dependencies
RUN yarn
RUN yarn build:production

#
# ---- Test & Build ----
# run linters, setup and tests
FROM dependencies AS build_secure_app
COPY packages/secure-app packages/secure-app
# Resolve the web-app dependencies
RUN yarn
RUN yarn secure:build:production

#
# ---- Release Web App ----
FROM base AS release_web_app
# Copy Web App
COPY --from=build_web_app /var/app/node_modules /var/app/packages/web-app/node_modules
COPY --from=build_web_app /var/app/packages/web-app/.next packages/web-app/.next
COPY packages/web-app/server.js packages/web-app/server.js
COPY packages/web-app/next.config.js packages/web-app/next.config.js
COPY packages/web-app/package.json packages/web-app/package.json
COPY packages/web-app/public packages/web-app/public
# Copy Secure App
COPY --from=build_secure_app /var/app/node_modules /var/app/packages/secure-app/node_modules
COPY --from=build_secure_app /var/app/packages/secure-app/.next packages/secure-app/.next
COPY packages/web-app/server.js packages/secure-app/server.js
COPY packages/web-app/next.config.js packages/secure-app/next.config.js
COPY packages/web-app/package.json packages/secure-app/package.json
COPY packages/web-app/public packages/secure-app/public
# Copy basic script
COPY package.json .
# expose port and define CMD
EXPOSE 3000
# By default we start the web app
CMD yarn start:production