# Setup for base environment
FROM python:3.7.12-slim-bullseye AS base

WORKDIR /usr/src/app/backend
COPY ./src /usr/src/app/backend/src
COPY ./requirements.txt /usr/src/app/backend/requirements.txt
RUN python3 -m pip --no-cache-dir install -r requirements.txt

EXPOSE 5000

# Setup for production environment
FROM base as build

ENV SERVER_ADDR="0.0.0.0"
ENV PORT="5000"
ENV ENVIRONMENT="production"

WORKDIR /usr/src/app/backend/src
RUN python3 -m pip install gunicorn
CMD gunicorn --bind $SERVER_ADDR:$PORT -w 4 app:gunicorn_app