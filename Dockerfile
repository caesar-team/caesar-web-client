# docker run -it node:8.12-alpine /bin/bash
# ---- Base Node ----
FROM node:8.12-alpine AS base
# Preparing
RUN mkdir -p /var/app && chown -R node /var/app
# Set working directory
WORKDIR /var/app
# Copy project file
COPY package.json .
COPY yarn.lock .

#
# ---- Dependencies ----
FROM base AS dependencies
#RUN apk add --update python build-base
# install node packages
#RUN yarn install --production --no-progress
# copy production node_modules aside
#RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN yarn install --no-progress

# Run in production mode
ENV NODE_ENV=production

#
# ---- Test & Build ----
# run linters, setup and tests
FROM dependencies AS build
#COPY . .
# Setup environment variables
ENV NODE_ENV=production
#RUN yarn build --no-progress

#
# ---- Release ----
FROM base AS release
RUN apk add --update bash && rm -rf /var/cache/apk/*
# copy production node_modules
COPY --from=dependencies /var/app/node_modules ./node_modules
#COPY --from=build /var/app/.next ./.next
COPY ./ ./

# Setup environment variables
ENV NODE_ENV=production
# expose port and define CMD
EXPOSE 3000
CMD yarn prod
