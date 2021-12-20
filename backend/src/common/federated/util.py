'''Utility classes to carry out FL'''


from federated.avg import FedAvg


class FederatedClient():
    '''Class to store metadata and model of a client in FL.'''

    def __init__(self, client_id, model, dataset_size):
        self.id = client_id
        self.model = model
        self.dataset_size = dataset_size


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
        self.server = None
        self.initial_model = initial_model

    def get_avg_scheme(self):
        fraction = self.config['fraction']
        dataset_size = sum([client['numMessages']
                           for client in self.client_objs])

        if self.config['strategy'] == 'fedavg':
            return FedAvg(dataset_size, fraction)

    def setup(self):
        clients = []
        for client_obj in self.client_objs:
            client_id = client_obj['clientID']
            dataset_size = client_obj['numMessages']
            model = client_obj['model']
            client = FederatedClient(client_id, model, dataset_size)
            clients.add(client)

        avg_scheme = self.get_avg_scheme()
        self.server = FederatedServer(clients, avg_scheme, self.initial_model)

    def aggregate(self):
        self.server.aggregate()
        # upload self.server.model to S3 as the latest global model
