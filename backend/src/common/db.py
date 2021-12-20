from common.util import add_model_obj, download_files_s3, download_tfjs_model
from common.federated.util import FedDriver
from common.dynamodb_handler import ConfigTable, ClientModelTable, DecimalEncoder
import json
import ast
from decimal import Decimal
from boto3.dynamodb.conditions import Key


def incrementModelIndex():
    # get the current config info from dynamodb
    current_config = ConfigTable.get_item(Key={'id': 0})
    current_config = ast.literal_eval(
        (json.dumps(current_config['Item'], cls=DecimalEncoder)))
    result = {}
    try:
        # check if it is the last client in that round
        if current_config['modelIndex'] == current_config['clients'] - 1:

            # increment the modelindex(becomes 0) and also increment rounds completed
            response = ConfigTable.update_item(
                Key={'id': 0},
                AttributeUpdates={
                    'roundsCompleted': {
                        'Value': current_config['roundsCompleted']+1
                    },
                    'modelIndex': {
                        'Value': (current_config['modelIndex']+1) % current_config['clients']
                    }
                },
                ReturnValues="UPDATED_NEW"
            )

            round_no = current_config['roundsCompleted']
            global_model = download_tfjs_model('fedmodelbucket')
            save_path = './src/data/clientmodels/'

            filtering_exp = Key('round').eq(round_no)
            client_objs = ClientModelTable.query(
                KeyConditionExpression=filtering_exp)
            client_objs = ast.literal_eval(
                (json.dumps(client_objs['Items'], cls=DecimalEncoder)))

            # download all client models in that round and add it to the client obj list.
            download_files_s3(f'round_{round_no}/',
                              save_path, 'clientmodelbucket')
            add_model_obj(save_path + f'round_{round_no}', client_objs)

            # carry out aggregation
            fed_driver = FedDriver(current_config, client_objs, global_model)
            fed_driver.aggregate()

        else:
            # round not completed so increment only modelIndex
            response = ConfigTable.update_item(
                Key={'id': 0},
                AttributeUpdates={
                    'modelIndex': {
                        'Value': (current_config['modelIndex']+1) % current_config['clients']
                    }
                },
                ReturnValues="UPDATED_NEW"
            )
    except Exception as e:
        result['status'] = 'Error'
        return result
    else:
        result['status'] = 'New value: ' + \
            str(response['Attributes']['modelIndex'])
        return result


def getRoundInfo():
    # get the current config info from dynamodb
    current_config = ConfigTable.get_item(Key={'id': 0})
    current_config = ast.literal_eval(
        (json.dumps(current_config['Item'], cls=DecimalEncoder)))
    info = {}
    info['modelIndex'] = current_config['modelIndex']
    info['roundsCompleted'] = current_config['roundsCompleted']
    return info


def addClientModel(data):
    result = {}
    try:
        # data['clientID'] = ClientModelTable.scan()['Count']
        data = json.loads(json.dumps(data), parse_float=Decimal)
        response = ClientModelTable.put_item(Item=data)
    except Exception as e:
        result['status'] = 'Error'
        return result
    else:
        result['status'] = 'Added'
    return result
