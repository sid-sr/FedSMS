'''Utility classes to carry out FL'''


from .avg import FedAvg, QFedAvg
from common.util import upload_model_tfjs
import numpy as np
from common.util import download_files_s3
import os
import logging
from sklearn.metrics import roc_auc_score

logger = logging.getLogger('gunicorn.error')


class FederatedClient():
    '''Class to store metadata and model of a client in FL.'''

    def __init__(self, client_id, model, dataset_size, loss, acc):
        self.id = client_id
        self.model = model
        self.dataset_size = dataset_size
        self.loss = loss
        self.accuracy = acc


class FederatedServer():
    '''Class to manage FederatedClient objects and carry out federated aggregation'''

    def __init__(self, clients, avg_scheme, initial_model):
        self.clients = clients
        self.avg_scheme = avg_scheme
        self.avg_scheme.set_num_clients(len(clients))
        self.model = initial_model

    def add_client(self, client):
        self.clients.append(client)

    def aggregate(self):
        self.model = self.avg_scheme.average(self.clients, self.model)

    def eval_global_model(self, test_data, test_labels):
        self.model.compile(optimizer='adam', loss='binary_crossentropy')
        logger.info("Compiled model")
        v1 = 2
        try:
            v1 = self.model.evaluate(test_data, test_labels, verbose=False)
        except Exception as e:
            logger.info(f"{e}")
            logger.exception(f"{e}")
        logger.info(f"evaluated {v1}")
        # v2 = ((self.model.predict(test_data) > 0.5).ravel() == test_labels).mean()
        v2 = roc_auc_score(test_labels, self.model.predict(test_data))
        logger.info(f"predicted {v2}")
        # return ((self.model.predict(test_data) > 0.5).ravel() == test_labels).mean(), \
        #    self.model.evaluate(test_data, test_labels, verbose=False)
        return v1, v2


class FedDriver():
    '''Helper class to orchestrate aggregation'''

    def __init__(self, config, client_objs, initial_model):
        self.config = config
        self.client_objs = client_objs
        self.initial_model = initial_model

        clients = []
        for c_id, client_obj in enumerate(self.client_objs):
            dataset_size = client_obj['numMessages']
            model = client_obj['model']
            loss = client_obj['trainLoss']
            acc = client_obj['trainAcc']
            client = FederatedClient(c_id, model, dataset_size, loss, acc)
            clients.append(client)

        avg_scheme = self.get_avg_scheme()
        self.server = FederatedServer(clients, avg_scheme, self.initial_model)

    def get_avg_scheme(self):
        fraction = self.config['fraction']
        dataset_size = sum([client['numMessages']
                           for client in self.client_objs])

        if self.config['strategy'] == 'fedavg':
            return FedAvg(dataset_size, fraction)
        elif self.config['strategy'] == 'qfedavg':
            return QFedAvg(dataset_size, fraction,
                           self.config['qfedAvg_q'],
                           self.config['qfedAvg_l'])

    def get_global_test_data(self, path):
        TEST_DATA_BUCKET = os.environ.get('TEST_DATA_BUCKET', '')
        download_files_s3(f'{TEST_DATA_BUCKET}/global/', path, 'datasplits')

        data_path = path + f'{TEST_DATA_BUCKET}/global/'
        dataset_file = data_path + 'test_dataset.npy'
        labels_file = data_path + 'test_labels.npy'

        with open(dataset_file, 'rb') as f:
            test_data = np.load(f)
        with open(labels_file, 'rb') as f:
            test_labels = np.load(f)

        os.remove(dataset_file)
        os.remove(labels_file)
        os.rmdir(data_path)
        os.rmdir(path + f'{TEST_DATA_BUCKET}')

        return test_data, test_labels

    def get_round_stats(self):
        path = '/tmp/src/data/'
        test_data, test_labels = self.get_global_test_data(path)
        logger.info("received test data")
        logger.info(
            f"received test data: {test_data.shape} {test_labels.shape}")
        # get test data.
        gl, ga = self.server.eval_global_model(test_data, test_labels)
        logger.info("Evaluated")
        acl = sum([client.loss for client in self.server.clients]) / \
            len(self.server.clients)

        aca = sum([client.accuracy for client in self.server.clients]) / \
            len(self.server.clients)

        return {
            'globalAcc': ga * 100,
            'globalLoss': gl,
            'averageClientAcc': aca,
            'averageClientLoss': acl
        }

    def aggregate(self):
        self.server.aggregate()
        # upload self.server.model to S3 as the latest global model and return status
        return upload_model_tfjs(self.server.model, 'fedmodelbucket')
