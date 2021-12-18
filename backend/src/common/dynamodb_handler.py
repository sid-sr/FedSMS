import boto3
import os
from dotenv import load_dotenv
import json
import decimal

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '')
REGION_NAME = 'us-east-2'


class DecimalEncoder(json.JSONEncoder):
    '''Helper class to convert a DynamoDB item to JSON.'''

    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)


client = boto3.client(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=REGION_NAME,
)
resource = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=REGION_NAME,
)

ConfigTable = resource.Table('config')
ClientModelTable = resource.Table('client_models')
