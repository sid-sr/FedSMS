'''Classes for different averaging schemes'''
import random


class AvgScheme():
    '''Blueprint for a general averaging scheme'''

    def __init__(self, dataset_size, frac=0.5):
        self.frac = frac
        self.dataset_size = dataset_size
        self.num_clients = None

    def set_num_clients(self, num_clients):
        self.num_clients = num_clients

    def __str__(self):
        return f"Averaging Scheme - fraction: {self.frac} number of clients: {self.num_clients}"

    # for subclass to override
    def average(self, clients, cur_model, tot_dataset_size):
        pass


class FedAvg(AvgScheme):
    '''FedAvg scheme: https://arxiv.org/pdf/1602.05629.pdf'''

    def __init__(self, dataset_size, frac=0.5):
        super(FedAvg, self).__init__(dataset_size, frac)

    def average(self, clients, cur_model):
        m = int(max(self.frac * self.num_clients, 1))
        s_clients = random.choices(clients, k=m)

        # list of weights obtained from each client
        client_weights = []
        for client in s_clients:
            client_weights.append((client.model.get_weights(), None))

        if len(client_weights) == 0:
            return

        num_layers = len(client_weights[0][0])
        updated_model = cur_model
        updated_weights = []

        for i in range(num_layers):
            # gets broadcasted
            updated_w = 0
            for cno, (client_w, _) in enumerate(client_weights):
                importance = s_clients[cno].dataset_size / self.dataset_size
                updated_w += importance * client_w[i]
            updated_weights.append(updated_w)

        updated_model.set_weights(updated_weights)
        return updated_model


class QFedAvg(AvgScheme):
    '''q-FedAvg scheme: https://arxiv.org/pdf/1905.10497.pdf'''

    def __init__(self, dataset_size, frac=0.5, q=1, l=0.1):
        super(QFedAvg, self).__init__(dataset_size, frac)
        self.q = q
        self.l = l

    def average(self, clients, cur_model):
        m = int(max(self.frac * self.num_clients, 1))
        s_clients = random.choices(clients, k=m)

        # list of weights obtained from each client
        client_weights = []
        cur_weights = cur_model.get_weights()
        for client in s_clients:
            client_weights.append((client.model.get_weights(), client.loss))

        if len(client_weights) == 0:
            return

        num_layers = len(client_weights[0][0])
        updated_model = cur_model
        updated_weights = []

        for i in range(num_layers):
            # gets broadcasted
            updated_w_num = 0
            updated_w_denom = 0
            for client_w, loss in client_weights:
                del_w = self.l * (cur_weights[i] - client_w[i])
                del_w_2 = (del_w ** 2).sum()
                loss_q = loss ** self.q
                del_ = loss_q * del_w
                h = self.q * loss ** (self.q - 1) * del_w_2 + self.l * loss_q
                updated_w_num += del_
                updated_w_denom += h
            updated_w = cur_weights[i] - (updated_w_num / updated_w_denom)
            updated_weights.append(updated_w)

        updated_model.set_weights(updated_weights)
        return updated_model
