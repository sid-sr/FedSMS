from flask import request, abort
from flask_restful import Resource
from common.dynamodb_handler import ConfigTable, DecimalEncoder
import json
import ast
from decimal import Decimal
from datetime import datetime


class Config(Resource):
    def get(self):
        # get the record in the config table
        current_config = ConfigTable.get_item(Key={'id': 0})
        # convert the decimal objects from dynamodb
        decimal_encoded = ast.literal_eval(
            (json.dumps(current_config['Item'], cls=DecimalEncoder)))
        return decimal_encoded

    def put(self):
        # edit certain config fields by taking input from the dashboard
        current_config = ConfigTable.get_item(Key={'id': 0})
        decimal_encoded = ast.literal_eval(
            (json.dumps(current_config['Item'], cls=DecimalEncoder)))
        # if there is a round in progress, config info cannot be updated
        if(decimal_encoded['modelIndex'] == 0):
            json_request = request.get_json(force=True)
            json_request = json.loads(json.dumps(
                json_request), parse_float=Decimal)
            try:
                response = ConfigTable.update_item(
                    Key={'id': 0},
                    AttributeUpdates={
                        'strategy': {'Value': json_request['strategy']},
                        'fraction': {'Value': json_request['fraction']},
                        'clients': {'Value': json_request['clients']},
                        'qfedAvg_q': {'Value': json_request['qfedAvg_q']},
                        'qfedAvg_l': {'Value': json_request['qfedAvg_l']},
                        'lastUpdatedAt': {'Value': str(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))}
                    },
                    ReturnValues="UPDATED_NEW"
                )
            except Exception as e:
                abort(400, 'Invalid request body')
            else:
                return "Updated"
        else:
            abort(400, 'Round in progress, cannot update configuration parameters')
