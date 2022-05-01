# Setup for base environment
FROM python:3.7.12-slim-bullseye AS base

WORKDIR /usr/src/app/backend
COPY ./requirements.txt /usr/src/app/backend/requirements.txt
RUN python3 -m pip --no-cache-dir install -r requirements.txt
COPY ./src /usr/src/app/backend/src

EXPOSE 5000

# Setup for production environment
FROM base as build

ENV SERVER_ADDR="0.0.0.0"
ENV PORT="5000"
ENV ENVIRONMENT="production"
ENV S3_URL="https://clientmodelbucket.s3.us-east-2.amazonaws.com/"

WORKDIR /usr/src/app/backend/src
RUN python3 -m pip install gunicorn
CMD gunicorn --log-file /app/logs/gunicorn.log --log-level DEBUG --bind $SERVER_ADDR:$PORT -w 1 app:gunicorn_app