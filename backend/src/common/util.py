'''Utility functions used across the app code.
'''

from shutil import rmtree
import keras
import os
import boto3
from botocore.exceptions import NoCredentialsError
import tensorflow.compat.v1 as tf
import tensorflowjs as tfjs
from random import random, randrange
from datetime import datetime, date, timedelta
import string
import names


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


def download_files_s3(s3_folder_path, local_folder_path, bucket):
    ''' Download all files from a folder in an S3 bucket .
    '''
    ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY', '')
    SECRET_KEY = os.environ.get('AWS_SECRET_KEY', '')

    s3_resource = boto3.resource('s3',
                                 aws_access_key_id=ACCESS_KEY,
                                 aws_secret_access_key=SECRET_KEY)
    try:
        bucket = s3_resource.Bucket(bucket)
        for obj in bucket.objects.filter(Prefix=s3_folder_path):
            save_path = local_folder_path + obj.key
            if not os.path.exists(os.path.dirname(save_path)):
                os.makedirs(os.path.dirname(save_path))
            if obj.key[-1] != '/':
                bucket.download_file(obj.key, local_folder_path + obj.key)
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


def add_model_obj(path, client_objs):
    '''Given a list of client objects, load the keras model associated with each client'''
    for client in client_objs:
        client['model'] = keras.models.load_model(
            os.path.join(path, f'model_{client["modelIndex"]}.h5'))


def download_tfjs_model(bucket):
    '''Download a tf.js model from S3 and load it as a Keras model'''
    # depends on pwd in local run vs docker
    temp_folder = "./globalmodel/"
    status = download_files_s3("", temp_folder, bucket)
    if not status:
        return False
    model = tfjs.converters.load_keras_model(temp_folder + 'model.json')
    # model.compile(optimizer='adam', loss='binary_crossentropy')
    tf.reset_default_graph()
    rmtree(temp_folder)
    return model


def random_date():  # generates a random time from the last 10 days
    start = datetime.now()-timedelta(10)
    end = datetime.now()
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    new_date = start + timedelta(seconds=random_second)
    epoch = datetime.utcfromtimestamp(0)
    time_milli = (new_date - epoch).total_seconds() * 1000.0
    return time_milli


def random_char(y):  # generates random string of length y
    return ''.join(random.choice(string.ascii_letters) for x in range(y))


def sender_name(spam):  # generates a random name based on whether it is spam or not
    if(spam):
        return random_char(2).upper()+'-'+str(random.randint(100000, 999999))
    else:
        return names.get_full_name()
