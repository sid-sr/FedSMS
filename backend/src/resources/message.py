import os
from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import json
from multiprocessing import Value


class MessageSchema(Schema):
    count = fields.Str(required=False)


if os.environ['ENVIRONMENT'] == 'production':
    mock_data_file = './data/mock/data0.json'
else:
    mock_data_file = './src/data/mock/data0.json'

schema = MessageSchema()
mock_data = json.load(open(mock_data_file))
counter = Value('i', 0)


class Message(Resource):
    def get(self):
        errors = schema.validate(request.args)

        if errors:
            abort(400, errors)

        if 'count' in request.args:
            # fill later with data from real dataset
            pass

        with counter.get_lock():
            out = counter.value
            counter.value += 1

        if os.environ['ENVIRONMENT'] == 'production':
            mock_data_file = f'./data/mock/testsplit/data{out % 10}.json'
        else:
            mock_data_file = f'./src/data/mock/testsplit/data{out % 10}.json'

        return json.load(open(mock_data_file))

        # return mock_data
