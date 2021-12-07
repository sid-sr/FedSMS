from flask import request, abort
from flask_restful import Resource
from marshmallow import Schema, fields
import json


class MessageSchema(Schema):
    count = fields.Str(required=False)


schema = MessageSchema()
mock_data_file = open('./src/data/mock/messages.json')
mock_data = json.load(mock_data_file)


class Message(Resource):
    def get(self):
        errors = schema.validate(request.args)

        if errors:
            abort(400, errors)

        if 'count' in request.args:
            # fill later with data from real dataset
            pass

        return mock_data
