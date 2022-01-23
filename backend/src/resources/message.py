import os
from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import json
from multiprocessing import Value
import boto3


class MessageSchema(Schema):
    count = fields.Str(required=False)


ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '')
SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '')
COUNT = int(os.environ.get('DATASPLIT_COUNT', 10))
DATASPLITPATH = os.environ.get('DATASLIT_PATH', '')
MESSAGE_BUCKET = os.environ.get('MESSAGE_BUCKET', '')

schema = MessageSchema()
s3 = boto3.resource('s3',
                    aws_access_key_id=ACCESS_KEY,
                    aws_secret_access_key=SECRET_KEY)
bucket = 'datasplits'
counter = Value('i', 0)


class Message(Resource):

    def get(self):
        errors = schema.validate(request.args)
        with counter.get_lock():
            out = counter.value
        if errors:
            abort(400, errors)

        obj = s3.Object(
            bucket, f'{MESSAGE_BUCKET}/splits/data{out % COUNT}.json')
        data = obj.get()['Body'].read()
        data = json.loads(data)

        with counter.get_lock():
            counter.value += 1

        return data
