# Setup for base environment
FROM node:16.13.0-alpine AS base
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN npm install

EXPOSE 3000
ENV HOST_ADDR="api"

# Setup for production (on top of base)
FROM base AS build
COPY public ./public
COPY src ./src
RUN npm run build

# serve the build
RUN npm install serve
CMD npx serve build