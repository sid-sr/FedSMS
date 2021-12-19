'''Utility classes to carry out FL'''


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
