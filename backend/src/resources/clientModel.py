import os
from flask_restful import Resource
from common.dynamodb_handler import ClientModelTable, DecimalEncoder
import ast
import json


class ClientModel(Resource):
    def get(self):
        # get all the records in the client_model table
        response = ClientModelTable.scan()
        # convert the decimal objects from dynamodb
        decimal_encoded = ast.literal_eval(
            (json.dumps(response['Items'], cls=DecimalEncoder)))
        return decimal_encoded
