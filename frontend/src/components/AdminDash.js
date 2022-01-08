/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import AWS from 'aws-sdk';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

const AdminDash = () => {

    AWS.config.update({
        region: 'us-east-2',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:7b076382-e0f8-4034-947b-5cda3e551910'
        })
    });

    const [selectedFileJSON, setSelectedFileJSON] = useState(null);
    const [selectedFileBIN, setSelectedFileBIN] = useState(null);

    const handleJSONInput = (e) => {
        setSelectedFileJSON(e.target.files[0]);
    }

    const handleBINInput = (e) => {
        setSelectedFileBIN(e.target.files[0]);
    }
    const handleUpload = async (file) => {

        var s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: 'fedmodelbucket' }
        });
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: 'fedmodelbucket',
            Key: file.name
        };
        s3.putObject(params)
            .send((err) => {
                if (err) console.log(err)
            })
    }
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

    const [execName, setExecName] = useState();
    const [modelList, setModelList] = useState([]);

    const [sortAsc, setSortAsc] = useState(1);
    const [searchRound, setSearchRound] = useState(null);

    const updateExecName = (e) => {
        setExecName(e.target.value);
    }

    const getModelList = () => {
        axios
            .get('/api/modelList')
            .then((res) => {
                toast.success('Fetched model list');
                setModelList(res.data);
                console.log(modelList);
            })
            .catch((err) => {
                toast.error('Error retrieving models!');
                console.error(err.toString());
            });
    };

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

    const resetConfig = () => {
        if (config.modelIndex != 0) {
            toast.error('Cannot reset when round is in progress!');
        }
        else {
            const responsePromise = Promise.resolve(axios.put('/api/reset', {
                execName: execName
            }));
            const configPromise = responsePromise.then(function () {
                handleUpload(selectedFileJSON);
                handleUpload(selectedFileBIN);
            })
            toast.promise(configPromise, {
                pending: {
                    render() {
                        return 'Request sent..';
                    },
                    icon: '⌛',
                },
                success: {
                    render({ res }) {
                        getConfig();
                        return 'Reset configuration!';
                    },
                    icon: '🟢',
                },
                error: {
                    render({ data }) {
                        return 'Error resetting configuration!';
                    },
                    icon: '⭕',
                },
            });
        }
    };

    useEffect(() => {
        getConfig();
        getModelList();
    }, []);

    const updateConfig = () => {
        console.log('New config: ', config);

        const responsePromise = axios.put('/api/config', {
            strategy: config.strategy,
            fraction: parseFloat(config.fraction),
            clients: parseInt(config.clients),
            qfedAvg_q: parseFloat(config.qfedAvg_q),
            qfedAvg_l: parseFloat(config.qfedAvg_l),
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

    const renderTooltip = (props, timestamp) => {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Received at {new Date(timestamp).toUTCString()}.
            </Tooltip>
        );
    };

    const updateID = (e) => {
        setSearchRound(e.target.value == '' ? null : e.target.value);
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
                <Col className="card-container" sm={4}>
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
                                        onChange={(e) => {
                                            setConfig({ ...config, strategy: 'qfedavg' });
                                        }}
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
                <Col sm={8}>
                    <div className="card-container">
                        <div className="card-title">🌎 Client Models Received</div>
                        <div className="card-content">
                            <div className="card-info">
                                Search for the models and metadata sent by different clients.
                                Training set size is the message count. Currently shows last 5
                                models received. Hover over client number for time info.
                            </div>
                            <div className="search-box mt-3">
                                <Form.Control
                                    style={{ width: '85%' }}
                                    type="text"
                                    placeholder="Enter Round"
                                    onChange={(e) => updateID(e)}
                                />
                                <Button
                                    variant="primary"
                                    style={{ width: '15%', marginLeft: '20px' }}
                                    onClick={(event) => {
                                        const newModelList = [...modelList];
                                        newModelList.sort(function (a, b) {
                                            return sortAsc * (b.numMessages - a.numMessages);
                                        });
                                        setSortAsc(-sortAsc);
                                        setModelList(newModelList);
                                    }}
                                >
                                    Sort {sortAsc == -1 ? '↑' : '↓'}
                                </Button>
                            </div>
                            <div className="table-container">
                                <Table striped hover size="sm">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '7%', paddingLeft: '10px' }}>#</th>
                                            <th>Round</th>
                                            <th>Model Index</th>
                                            <th style={{ width: '25%' }}>Training Set Size</th>
                                            <th>Train Loss</th>
                                            <th style={{ width: '20%' }}>Train Accuracy</th>
                                            <th style={{ width: '10%' }}>S3</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ overflow: 'auto' }}>
                                        {modelList
                                            .filter(
                                                (e) => searchRound === null || e.round == searchRound
                                            )
                                            .map((model, ind) => {
                                                return (
                                                    <tr key={ind}>
                                                        <OverlayTrigger
                                                            placement="right"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={(props) =>
                                                                renderTooltip(props, model.timestamp)
                                                            }
                                                        >
                                                            {/* change to time info later */}
                                                            <td style={{ paddingLeft: '10px' }}></td>
                                                        </OverlayTrigger>
                                                        <td>{model.round}</td>
                                                        <td>{model.modelIndex}</td>
                                                        <td>{model.numMessages}</td>
                                                        <td>{model.trainLoss}</td>
                                                        <td>{model.trainAcc} %</td>
                                                        <td>
                                                            <a
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                href={model.modelFile}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                🔗
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </Table>
                                <div style={{ textAlign: 'center' }}>
                                    <Form.Text className="text-muted">
                                        {modelList.length === 0
                                            ? 'No client models are saved at this moment..'
                                            : null}
                                    </Form.Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="dash-container">
                <Col className="card-container" sm={4}>
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
            <Row className="dash-container">
                <Col className="card-container" sm={4}>
                    <div className="card-title">🔄 Reset</div>
                    <div className="card-content">
                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label>Name of Execution</Form.Label>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => updateExecName(e)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>New json file for global model</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleJSONInput}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>New bin file for global model</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleBINInput}
                                />
                            </Form.Group>
                            <Button
                                style={{ width: '100%', margin: '10px 0px' }}
                                variant="primary"
                                onClick={resetConfig}
                            >
                                Reset all data
                            </Button>
                            <div className="text-muted" >
                                <p style={{ fontSize: '14px' }}>Note: All parameters will be reset to the original values and models will be deleted. Please ensure that a round is not in progress.</p>
                            </div>
                        </Form>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </div >
    );
};

export default AdminDash;
