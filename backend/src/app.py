from flask import Flask
from flask_restful import Api

from resources.hello import Hello
from resources.message import Message
from resources.fedmodel import FedModel
from resources.config import Config
from resources.clientModel import ClientModel

from common.util import get_addr

app = Flask(__name__, static_folder='../build', static_url_path='/')
api = Api(app)

api.add_resource(Hello, '/api/hello')
api.add_resource(Message, '/api/message')
api.add_resource(FedModel, '/api/model')
api.add_resource(Config, '/api/config')
api.add_resource(ClientModel, '/api/clientModel')

# Dev
if __name__ == '__main__':
    host, port = get_addr()
    app.run(host=host, port=port, debug=True)
# Prod
else:
    gunicorn_app = app
