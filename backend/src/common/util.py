'''Utility functions used across the app code.
'''

import os


def get_addr(default_host='127.0.0.1', default_port='5000'):
    '''Return the address of the API depending on local or docker run.
    '''
    host = os.environ.get('SERVER_ADDR', default_host)
    port = os.environ.get('PORT', default_port)
    return host, port
