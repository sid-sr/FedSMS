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

            round_stats = fed_driver.get_round_stats()

            update_exp_list = [
                "roundsCompleted = :r",
                "modelIndex = :m",
                "averageClientLoss = list_append (averageClientLoss, :acl)",
                "averageClientAcc = list_append (averageClientAcc, :aca)",
                "globalLoss = list_append (globalLoss, :gl)",
                "globalAcc = list_append (globalAcc, :ga)"
            ]

            update_exp = "set " + ", ".join(update_exp_list)

            # increment the modelindex (becomes 0), increment rounds completed and add stats
            response = ConfigTable.update_item(
                Key={'id': 0},
                UpdateExpression=update_exp,
                ExpressionAttributeValues={
                    ':r': Decimal(current_config['roundsCompleted'] + 1),
                    ':m': Decimal((current_config['modelIndex'] + 1) % current_config['clients']),
                    ':ga': [Decimal(str(round_stats['globalAcc']))],
                    ':gl': [Decimal(str(round_stats['globalLoss']))],
                    ':aca': [Decimal(str(round_stats['averageClientAcc']))],
                    ':acl': [Decimal(str(round_stats['averageClientLoss']))]
                },
                ReturnValues="UPDATED_NEW"
            )

        else:
            # round not completed so increment only modelIndex
            response = ConfigTable.update_item(
                Key={'id': 0},
                UpdateExpression="set modelIndex = :m",
                ExpressionAttributeValues={
                    ':m': Decimal((current_config['modelIndex']+1) % current_config['clients'])
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
