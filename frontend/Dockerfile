# Setup for base environment
FROM node:16.13.0-alpine AS base
WORKDIR /usr/src/app/frontend
COPY package*.json ./
RUN npm install

EXPOSE 3000

# Setup for production (on top of base)
FROM base AS build
COPY public ./public
COPY src ./src
RUN npm run build

# serve the build
FROM nginx:1.19

ENV HOST_ADDR="api"
COPY --from=build /usr/src/app/frontend/build /usr/share/nginx/html
COPY nginx.conf.template ./

CMD ["/bin/bash", "-c", "envsubst '${HOST_ADDR}' < ./nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]