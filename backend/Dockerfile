# Setup for base environment
FROM alpine:latest AS base

RUN apk update
RUN apk add py-pip
RUN apk add --no-cache python3-dev 
RUN pip install --upgrade pip

WORKDIR /usr/src/app/backend
COPY . /usr/src/app/backend
RUN pip --no-cache-dir install -r requirements.txt

EXPOSE 5000

# Setup for production environment
FROM base as build

ENV SERVER_ADDR="0.0.0.0"
ENV PORT="5000"
ENV ENVIRONMENT="production"

WORKDIR /usr/src/app/backend/src
RUN pip install gunicorn
CMD gunicorn --bind $SERVER_ADDR:$PORT -w 4 app:gunicorn_app