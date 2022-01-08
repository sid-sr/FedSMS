from flask_restful import Resource
import decimal
from flask import request, abort
from common.dynamodb_handler import ClientModelTable, ConfigTable, DecimalEncoder
import json
import ast
from decimal import Decimal
import datetime
import boto3
from boto3.dynamodb.types import TypeSerializer, TypeDeserializer
import sys


class Reset(Resource):

    def getConfigData(self):
        current_config = ConfigTable.get_item(Key={'id': 0})
        # convert the decimal objects from dynamodb
        decimal_encoded = ast.literal_eval(
            (json.dumps(current_config['Item'], cls=DecimalEncoder)))
        return decimal_encoded

    def getClientModelData(self):
        # get all the records in the client_model table
        response = ClientModelTable.scan()
        # convert the decimal objects from dynamodb
        decimal_encoded = ast.literal_eval(
            (json.dumps(response['Items'], cls=DecimalEncoder)))
        return decimal_encoded

    def put(self):
        try:
            json_request = request.get_json(force=True)
            timestamp = datetime.datetime.now().isoformat()
            # write the existing config record as a json into s3
            s3 = boto3.resource('s3')
            s3object = s3.Object('previoustrialdata',
                                 json_request['execName']+'-'+timestamp+'/config.json')

            s3object.put(
                Body=(bytes(json.dumps(self.getConfigData()).encode('UTF-8')))
            )

            # write the existing client model data as a json into s3
            s3object = s3.Object('previoustrialdata',
                                 json_request['execName']+'-'+timestamp+'/clientmodel.json')
            s3object.put(
                Body=(bytes(json.dumps(self.getClientModelData()).encode('UTF-8')))
            )

            # # copy the 2 model files from fedmodelbucket to the new s3 folder
            src = s3.Bucket('fedmodelbucket')
            dst = s3.Bucket('previoustrialdata')
            for k in src.objects.all():
                # copy stuff to your destination here
                copy_source = {
                    'Bucket': 'fedmodelbucket',
                    'Key': k.key
                }
                dst.copy(
                    copy_source, json_request['execName']+'-'+timestamp+'/'+k.key)
                # then delete the source key
                k.delete()

            # clear the client model table
            scan = ClientModelTable.scan()
            with ClientModelTable.batch_writer() as batch:
                for each in scan['Items']:
                    batch.delete_item(
                        Key={
                            'round': each['round'],
                            'modelIndex': each['modelIndex']
                        }
                    )

            # reset the data in the config table
            response = ConfigTable.update_item(
                Key={'id': 0},
                AttributeUpdates={
                    'strategy': {'Value': 'fedavg'},
                    'fraction': {'Value': '1'},
                    'clients': {'Value': '5'},
                    'qfedAvg_q': {'Value': '0.1'},
                    'qfedAvg_l': {'Value': '1'},
                    'roundsCompleted': {'Value': '0'},
                    'averageClientAcc': {'Value': []},
                    'averageClientLoss': {'Value': []},
                    'globalAcc': {'Value': []},
                    'globalLoss': {'Value': []},
                    'lastUpdatedAt': {'Value': datetime.datetime.now().isoformat()}
                },
                ReturnValues="UPDATED_NEW"
            )

            # delete all the folders inside the clientmodelbucket
            bucket = s3.Bucket('clientmodelbucket')
            bucket.objects.all().delete()

            # # delete the model files from the fedmodelbucket
            # bucket = s3.Bucket('fedmodelbucket')
            # bucket.objects.all().delete()

        except Exception as e:
            print(e, flush=True)
            abort(400, e)
        else:
            return "Updated"
