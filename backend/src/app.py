from flask import Flask
from flask_restful import Api
import os

from resources.hello import Hello

app = Flask(__name__, static_folder='../build', static_url_path='/')
api = Api(app)

api.add_resource(Hello, '/api/hello')

# main driver function
if __name__ == '__main__':
    host = os.environ.get('SERVER_ADDR', '127.0.0.1')
    port = os.environ.get('PORT', '5000')
    app.run(host=host, port=port, debug=True)
