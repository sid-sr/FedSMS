'''Utility functions used across the app code.
'''

import os
import boto3
from botocore.exceptions import NoCredentialsError
import tensorflowjs as tfjs
from shutil import rmtree


def get_addr(default_host='127.0.0.1', default_port='5000'):
    ''' Return the address of the API depending on local or docker run.
    '''
    host = os.environ.get('SERVER_ADDR', default_host)
    port = os.environ.get('PORT', default_port)
    return host, port


def upload_files_s3(file_info, bucket):
    ''' Upload a list of files to an S3 bucket.
        file_info: list of (local_file_name, s3_file_name) tuples.
    '''
    ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '')
    SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '')

    s3 = boto3.client('s3',
                      aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY)
    try:
        for local_name, s3_name in file_info:
            s3.upload_file(local_name, bucket, s3_name)
        return True
    except FileNotFoundError:
        print("The file was not found!", flush=True)
        return False
    except NoCredentialsError:
        print("Credentials error!", flush=True)
        return False


def upload_model_tfjs(tf_model, bucket):
    ''' Save a Tensorflow model as a tensorflow.js model and upload it to S3
    '''
    temp_folder = "model_tfjs_temp_folder"
    tfjs.converters.save_keras_model(tf_model, temp_folder)
    file_info = []

    for file_name in os.listdir(temp_folder):
        file_info.append((os.path.join(temp_folder, file_name), file_name))

    status = upload_files_s3(file_info, bucket)
    # clean up
    rmtree(temp_folder)
    return status


def upload_model_h5(model, bucket, roundInfo):
    ''' Save a Tensorflow model as a .h5 model file and upload it to S3
    '''
    file_name = 'model_' + str(roundInfo['modelIndex']) + ".h5"
    s3_folder_name = 'round_' + str(roundInfo['roundsCompleted'])
    temp_folder = "./src/data/saved_models/"
    model.save(temp_folder + '/' + file_name)

    file_info = []
    file_info.append(
        (temp_folder + file_name, s3_folder_name + '/' + file_name))
    status = upload_files_s3(file_info, bucket)
    # clean up
    rmtree(temp_folder)
    if status:
        return file_info[0][1]
    else:
        return 'Error'
