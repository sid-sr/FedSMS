import axios from 'axios';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { CgTrashEmpty } from 'react-icons/cg';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import {
  RiChatDownloadLine,
  RiFileDownloadLine,
  RiFileUploadLine,
} from 'react-icons/ri';
import { VscGear } from 'react-icons/vsc';
import ClipLoader from 'react-spinners/ClipLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import '../styles/settings.css';
import db from '../utils/db';
import { loadModelFromURL, saveModel, trainModel } from '../utils/train';
function Settings() {
  const [fetchText, setFetchText] = useState('Fetch');
  const [uploadText, setUploadText] = useState('Upload');
  const [deleteText, setDeleteText] = useState('Clear DB');
  const [fetchModelText, setFetchModelText] = useState('Fetch Model');
  const [trainModelText, setTrainModelText] = useState('Train Model');
  const [customSample, setCustomSample] = useState(false);
  const [trainParams, setTrainParams] = useState({
    sampleSize: 64,
    learningRate: 0.01,
    epochs: 3,
  });
  const [trainStats, setTrainStats] = useState({
    numMessages: 30,
    trainLoss: 0.3,
    trainAcc: 0.7,
  });
  const [model, setModel] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [epochStats, setEpochStats] = useState({
    loss: '-',
    epoch: '-',
    trainSetSize: 0,
    spamPercent: 0,
  });

  useEffect(async () => {
    setEpochStats({ ...epochStats, trainSetSize: await db.messages.count() });
  }, []);

  async function loadModel(event) {
    event.preventDefault();
    if (trainParams.learningRate != '') {
      setFetchModelText('Fetching');
      const model = await loadModelFromURL(
        '/api/download/model.json',
        trainParams.learningRate
      );
      setModel(model);
      setFetchModelText('Fetched');
    }
  }

  async function train(event) {
    event.preventDefault();
    if (trainParams.epochs != '' && trainParams.sampleSize != '')
      if (trainModelText == 'Train Model') {
        setTrainModelText('Training');
        const messages = await db.messages.toArray();
        const stats = await trainModel(
          messages,
          model,
          trainParams.epochs,
          32,
          trainParams.sampleSize,
          async (epoch, logs) => {
            setEpochStats({
              ...epochStats,
              epoch: epoch,
              loss: Math.round(logs.loss * 1000) / 1000,
            });
          }
        );
        if (stats) {
          setTrainStats(stats);
          setTrainModelText('Trained');
        } else {
          setTrainModelText('Failed');
        }
      }
  }

  async function fetching() {
    if (fetchText == 'Fetch') {
      setFetchText('Fetching');
      axios
        .get('/api/message')
        .then((res) => {
          Promise.all([db.messages.bulkAdd(res.data), db.messages.count()])
            .then((values) => {
              console.log(`Added ${res.data.length} messages to IndexedDB`);
              setEpochStats({
                ...epochStats,
                // count value
                trainSetSize: values[1],
              });
            })
            .catch((err) => {
              console.error(err.toString());
            });
          setFetchText('Fetched');
        })
        .catch((err) => {
          console.error(err.toString());
        });
    }
  }

  async function uploading() {
    if (uploadText == 'Upload') {
      // if (!model || trainModelText !== 'Trained') return;
      setUploadText('Uploading');
      await saveModel(model, window.location.origin + '/api/model', trainStats);
      setUploadText('Uploaded');
    }
  }

  async function deleteMessages() {
    if (deleteText == 'Clear DB') {
      await db.messages.clear();
      setEpochStats({ ...epochStats, trainSetSize: await db.messages.count() });
      setDeleteText('Cleared');
      setTimeout(() => setDeleteText('Clear DB'), 2000);
    }
  }

  return (
    <div className="container">
      <a href="/home" className="backText">
        <FaArrowLeft style={{ marginBottom: '2px' }}></FaArrowLeft>
        <span>Back</span>
      </a>
      <h1 className="settingsHeading">Settings</h1>
      <hr className="divider" />
      <h3 className="cardHeading">Fetch Messages</h3>
      <div className="settingsCard">
        <button
          className="cardAction"
          style={{ marginTop: '5px' }}
          onClick={fetching}
        >
          <RiChatDownloadLine className="settingsIcon" />
          {fetchText}&nbsp;
          {fetchText == 'Fetching' ? (
            <ClipLoader size={10} color={'white'} />
          ) : null}
        </button>
      </div>
      <h3 className="cardHeading">Manual Tests</h3>
      <div className="settingsCard">
        <form onSubmit={loadModel}>
          <Form.Group as={Row} className="mb-3 inputLabel">
            <Form.Label column xs={5}>
              Learning Rate
            </Form.Label>
            <Col xs={7}>
              <Form.Control
                required
                className="inputBox"
                type="number"
                onChange={(e) => {
                  setTrainParams({
                    ...trainParams,
                    learningRate: parseInt(e.target.value),
                  });
                }}
                placeholder="Enter Learning Rate"
                value={trainParams.learningRate}
                min="0"
                max="1"
                step="0.01"
              />
            </Col>
          </Form.Group>
          <button className="cardAction" type="submit">
            <RiFileDownloadLine className="settingsIcon" />
            {fetchModelText} &nbsp;
            {fetchModelText == 'Fetching' ? (
              <PulseLoader size={5} color={'white'} />
            ) : null}
            {fetchModelText == 'Fetched' ? (
              <FaCheckCircle></FaCheckCircle>
            ) : null}
          </button>
        </form>

        <br />
        <hr className="divider2" />
        <form onSubmit={train}>
          <Form.Group as={Row} className="mb-3 inputLabel">
            <Form.Label column xs={5}>
              Epochs
            </Form.Label>
            <Col xs={7}>
              <Form.Control
                required
                className="inputBox"
                type="number"
                placeholder="Enter Epochs"
                onChange={(e) => {
                  setTrainParams({
                    ...trainParams,
                    epochs: parseInt(e.target.value),
                  });
                }}
                value={trainParams.epochs}
                min="1"
                max="100"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3 inputLabel">
            <Form.Label column xs={5}>
              Sample Size
            </Form.Label>
            <Col xs={7}>
              <Form.Control
                disabled={customSample ? true : false}
                style={{ color: customSample ? 'black' : '#bbbaba' }}
                required
                className="inputBox"
                type="number"
                placeholder="Enter Sample Size"
                onChange={(e) => {
                  setTrainParams({
                    ...trainParams,
                    sampleSize: e.target.value,
                  });
                }}
                value={trainParams.sampleSize}
                min="1"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3 inputLabel">
            <Form.Label column xs={5}></Form.Label>
            <Col xs={7}>
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="All Data"
                  checked={customSample}
                  onChange={() => {
                    setCustomSample(!customSample);
                    setTrainParams({
                      ...trainParams,
                      sampleSize: epochStats.trainSetSize,
                    });
                  }}
                />
              </Form>
            </Col>
          </Form.Group>

          <button className="cardAction" type="submit">
            <VscGear className="settingsIcon" />
            {trainModelText} &nbsp;
            {trainModelText == 'Training' ? (
              <PulseLoader size={5} color={'white'} />
            ) : null}
            {trainModelText == 'Trained' ? (
              <FaCheckCircle></FaCheckCircle>
            ) : null}
            {trainModelText == 'Failed' ? (
              <FaExclamationCircle></FaExclamationCircle>
            ) : null}
          </button>
        </form>
      </div>

      <h3 className="cardHeading">Upload Model</h3>
      <div className="settingsCard">
        <button className="cardAction" onClick={uploading}>
          <RiFileUploadLine className="settingsIcon" />
          {uploadText} &nbsp;
          {uploadText == 'Uploading' ? (
            <PulseLoader size={5} color={'white'} />
          ) : null}
          {uploadText == 'Uploaded' ? <FaCheckCircle></FaCheckCircle> : null}
        </button>
      </div>
      <h3 className="cardHeading">Reset</h3>
      <div className="settingsCard">
        <button
          className="cardAction"
          // style={{ backgroundColor: '#CB4C4E' }}
          onClick={deleteMessages}
        >
          <CgTrashEmpty className="settingsIcon" />
          {deleteText} &nbsp;
          {deleteText == 'Clearing' ? (
            <PulseLoader size={5} color={'white'} />
          ) : null}
          {deleteText == 'Cleared' ? <FaCheckCircle></FaCheckCircle> : null}
          {deleteText == 'Failed' ? (
            <FaExclamationCircle></FaExclamationCircle>
          ) : null}
        </button>
      </div>
      <h3 className="cardHeading">Stats</h3>
      <div className="statsCard">
        <div className="statsInfo">
          <div className="statsCol">
            <div className="statsNameRow">Messages: </div>
            <div className="statsNameRow">Epoch: </div>
            <div className="statsNameRow">Loss:</div>
          </div>
          <div className="statsCol">
            <div className="statsValRow">{epochStats.trainSetSize}</div>
            <div className="statsValRow">{epochStats.epoch}</div>
            <div className="statsValRow">{epochStats.loss}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
