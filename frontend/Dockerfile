FROM node:16.13.0-alpine

WORKDIR /usr/src/app/frontend

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]