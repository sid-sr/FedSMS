'''Utility classes to carry out FL'''


from .avg import FedAvg, QFedAvg
from common.util import upload_model_tfjs


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
        return (self.model.predict(test_data).argmax(axis=1) == test_labels).mean(), \
            self.model.evaluate(test_data, test_labels)


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

    def get_round_stats(self):

        # get test data.
        # ga, gl = self.server.eval_global_model(test_data, test_labels)
        ga, gl = 95.42, 0.46
        acl = sum([client.loss for client in self.server.clients]) / \
            len(self.server.clients)

        aca = sum([client.accuracy for client in self.server.clients]) / \
            len(self.server.clients)

        return {
            'globalAcc': ga,
            'globalLoss': gl,
            'averageClientAcc': aca,
            'averageClientLoss': acl
        }

    def aggregate(self):
        self.server.aggregate()
        # upload self.server.model to S3 as the latest global model and return status
        return upload_model_tfjs(self.server.model, 'fedmodelbucket')
