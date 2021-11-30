FROM alpine:latest

RUN apk update
RUN apk add py-pip
RUN apk add --no-cache python3-dev 
RUN pip install --upgrade pip

WORKDIR /usr/src/app/backend
COPY . /usr/src/app/backend
RUN pip --no-cache-dir install -r requirements.txt

ENV SERVER_ADDR="0.0.0.0"
ENV PORT="5000"

CMD ["python3", "./src/app.py"]