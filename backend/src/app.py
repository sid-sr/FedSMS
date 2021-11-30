
# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask
import os

# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__, static_folder='../build', static_url_path='/')

# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.


@app.route('/api/hello')
def hello_world():
    return 'Hello World'


# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application
    # on the local development server.
    host = os.environ.get('SERVER_ADDR', '127.0.0.1')
    port = os.environ.get('PORT', '5000')
    app.run(host=host, port=port, debug=True)
