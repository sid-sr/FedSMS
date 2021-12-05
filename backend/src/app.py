from flask import Flask
from flask_restful import Api

from resources.hello import Hello
from common.util import get_addr

app = Flask(__name__, static_folder='../build', static_url_path='/')
api = Api(app)

api.add_resource(Hello, '/api/hello')

# Dev
if __name__ == '__main__':
    host, port = get_addr()
    app.run(host=host, port=port, debug=True)
# Prod
else:
    gunicorn_app = app
