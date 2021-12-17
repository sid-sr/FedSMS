from common.dynamodb_handler import ConfigTable, DecimalEncoder
import json
import ast


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
            # insert call to aggregate
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
