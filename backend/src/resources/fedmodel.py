from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from flask_restful import Resource

import io

from flask import Response, request
import tensorflow.compat.v1 as tf
import tensorflowjs as tfjs
import werkzeug.formparser
tf.disable_v2_behavior()


class ModelReceiver(object):

    def __init__(self):
        self._model = None
        self._model_json_bytes = None
        self._model_json_writer = None
        self._weight_bytes = None
        self._weight_writer = None

    @property
    def model(self):
        self._model_json_writer.flush()
        self._weight_writer.flush()
        self._model_json_writer.seek(0)
        self._weight_writer.seek(0)

        json_content = self._model_json_bytes.read()
        weights_content = self._weight_bytes.read()
        return tfjs.converters.deserialize_keras_model(
            json_content,
            weight_data=[weights_content],
            use_unique_name_scope=True)

    def stream_factory(self,
                       total_content_length,
                       content_type,
                       filename,
                       content_length=None):
        # Note: this example code isnot* thread-safe.
        if filename == 'model.json':
            self._model_json_bytes = io.BytesIO()
            self._model_json_writer = io.BufferedWriter(self._model_json_bytes)
            return self._model_json_writer
        elif filename == 'model.weights.bin':
            self._weight_bytes = io.BytesIO()
            self._weight_writer = io.BufferedWriter(self._weight_bytes)
            return self._weight_writer


class FedModel(Resource):

    def __init__(self):
        self.model_receiver = ModelReceiver()

    def post(self):
        werkzeug.formparser.parse_form_data(
            request.environ, stream_factory=self.model_receiver.stream_factory)
        with tf.Graph().as_default(), tf.Session():
            model = self.model_receiver.model
            model.summary()
            model.save(f'./src/data/saved_models/model.h5')
            del model
        return Response(status=200)
