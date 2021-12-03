FROM node:16.13.0-alpine

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . ./

ENV HOST_ADDR="api"

EXPOSE 3000

CMD ["npm", "start"]