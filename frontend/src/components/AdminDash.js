/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/admin.css';
import 'react-toastify/dist/ReactToastify.css';

const AdminDash = () => {
  const [config, setConfig] = useState({
    id: 1,
    modelIndex: 0,
    strategy: 'qfedavg',
    fraction: 0.4,
    roundsCompleted: 0,
    clients: 5,
    globalLoss: [],
    globalAcc: [],
    averageClientLoss: [],
    averageClientAcc: [],
    qfedAvg_q: 0.1,
    qfedAvg_l: 1,
    lastUpdatedAt: '16/12/2021 11:59AM',
  });

  const getConfig = () => {
    axios
      .get('/api/config')
      .then((res) => {
        toast.success('Fetched latest configuration');
        setConfig(res.data);
        console.log(config);
      })
      .catch((err) => {
        toast.error('Error retrieving configuration!');
        console.error(err.toString());
      });
  };

  useEffect(() => {
    getConfig();
  }, []);

  const updateConfig = () => {
    console.log('New config: ', config);

    const responsePromise = axios.put('/api/config', {
      strategy: config.strategy,
      fraction: config.fraction,
      clients: config.clients,
      qfedAvg_q: config.qfedAvg_q,
      qfedAvg_l: config.qfedAvg_l,
    });
    toast.promise(responsePromise, {
      pending: {
        render() {
          return 'Request sent..';
        },
        icon: '⌛',
      },
      success: {
        render({ res }) {
          getConfig();
          return 'Updated configuration!';
        },
        icon: '🟢',
      },
      error: {
        render({ data }) {
          return 'Error updating configuration! Round may be in progress!';
        },
        icon: '⭕',
      },
    });
  };

  const updateValue = (event, field) => {
    console.log(field, event.target.value);
    setConfig({ ...config, [field]: event.target.value });
  };

  return (
    <div className="main-container">
      <ToastContainer />
      <div className="main-title">
        <h1>FedSMS Admin Panel</h1>
      </div>
      <Row className="dash-container">
        <Col className="card-container">
          <div className="card-title">⚙️ Configuration</div>
          <div className="card-content">
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>
                  Fraction of models to combine: <b>{config.fraction}</b>
                </Form.Label>
                <Form.Range
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={config.fraction}
                  onChange={(e) => updateValue(e, 'fraction')}
                ></Form.Range>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Number of clients</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={100}
                  value={config.clients}
                  onChange={(e) => updateValue(e, 'clients')}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Federated Averaging Strategy</Form.Label>
                <div style={{ textAlign: 'center' }}>
                  <Form.Check
                    inline
                    label="FedAvg"
                    name="fedavg"
                    type="radio"
                    checked={config.strategy === 'fedavg'}
                    onChange={(e) =>
                      setConfig({ ...config, strategy: 'fedavg' })
                    }
                    id="inline-radio-1"
                  />
                  <Form.Check
                    inline
                    label="q-FedAvg"
                    name="qfedavg"
                    type="radio"
                    checked={config.strategy === 'qfedavg'}
                    onChange={(e) =>
                      setConfig({ ...config, strategy: 'qfedavg' })
                    }
                    id="inline-radio-2"
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>q-FedAvg &apos;q&apos; Parameter</Form.Label>
                <Form.Control
                  type="number"
                  mmin={0}
                  max={1}
                  step={0.05}
                  value={config.qfedAvg_q}
                  onChange={(e) => updateValue(e, 'qfedAvg_q')}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>q-FedAvg &apos;l&apos; Parameter</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.qfedAvg_l}
                  onChange={(e) => updateValue(e, 'qfedAvg_l')}
                />
                <Form.Text className="text-muted">
                  The q and l parameters affect only the q-FedAvg strategy.
                </Form.Text>
              </Form.Group>
              <Button
                style={{ width: '100%', margin: '10px 0px' }}
                variant="primary"
                onClick={updateConfig}
              >
                Update
              </Button>
            </Form>
          </div>
        </Col>
        <Col>
          <div></div>
        </Col>
      </Row>
      <Row className="dash-container">
        <Col className="card-container">
          <div className="card-content stats">
            <div className="key">🗺️ Completed Rounds: </div>
            <div className="value">{config.roundsCompleted}</div>
            <div className="key">🧾 Current Model Index: </div>
            <div className="value">
              {config.modelIndex} / {config.clients}
            </div>
            <div className="info">
              The model index represents the number of client models received in
              the current round. When the next round starts, it&apos;s set to
              zero.
            </div>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
};

export default AdminDash;
