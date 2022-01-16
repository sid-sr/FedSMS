import os
from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import json
from multiprocessing import Value
import boto3

from io import BytesIO


class MessageSchema(Schema):
    count = fields.Str(required=False)


if os.environ['ENVIRONMENT'] == 'production':
    mock_data_file = './data/mock/data0.json'
else:
    mock_data_file = './src/data/mock/data0.json'

schema = MessageSchema()
# read data0.json from s3
ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '')
SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '')
COUNT = os.environ.get('DATASPLIT_COUNT', '')
DATASPLITPATH = os.environ.get('DATASLIT_PATH', '')

s3 = boto3.resource('s3',  aws_access_key_id=ACCESS_KEY,
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

        obj = s3.Object(bucket, DATASPLITPATH+str(out % COUNT)+'.json')
        data = obj.get()['Body'].read()
        data = json.loads(data)
        with counter.get_lock():
            counter.value += 1
        return data
