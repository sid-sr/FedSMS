import axios from 'axios';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { CgTrashEmpty } from 'react-icons/cg';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { RiChatDownloadLine, RiFileDownloadLine, RiFileUploadLine } from 'react-icons/ri';
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


  async function loadModel() {
    setFetchModelText('Fetching');
    const model = await loadModelFromURL('/api/download/model.json', 0.01);
    setModel(model);
    setFetchModelText('Fetched');
  }

  async function train() {
    if (trainModelText == 'Train Model') {
      setTrainModelText('Training');
      const messages = await db.messages.toArray();
      const stats = await trainModel(
        messages,
        model,
        3,
        32,
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
        ><RiChatDownloadLine className="settingsIcon" />
          {fetchText}&nbsp;
          {fetchText == 'Fetching' ? (
            <ClipLoader size={10} color={'white'} />
          ) : null}
        </button>
      </div>

      <br />

      <h3 className="cardHeading">Manual Tests</h3>
      <div className="settingsCard">
        <Form>
          <Form.Group className="mb-3" >
            <Form.Label >Learning Rate</Form.Label>
            <Form.Control type="number" onChange={(e) => { setTrainParams({ ...trainParams, learningRate: e.target.value }); }} placeholder="Enter Learning Rate" value={trainParams.learningRate} />
          </Form.Group>
          <button className="cardAction" onClick={loadModel}>
            <RiFileDownloadLine className="settingsIcon" />
            {fetchModelText} &nbsp;
            {fetchModelText == 'Fetching' ? (
              <PulseLoader size={5} color={'white'} />
            ) : null}
            {fetchModelText == 'Fetched' ? <FaCheckCircle></FaCheckCircle> : null}
          </button>
        </Form>

        <br />
        <hr className="divider2" />
        <Form>
          <Form.Group className="mb-3" >
            <Form.Label>Epochs</Form.Label>
            <Form.Control type="number" placeholder="Enter Learning Rate" onChange={(e) => { setTrainParams({ ...trainParams, epochs: e.target.value }); }} value={trainParams.epochs} />
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>Sample Size</Form.Label>
            <Form.Control type="number" placeholder="Enter Learning Rate" onChange={(e) => { setTrainParams({ ...trainParams, sampleSize: e.target.value }); }} value={trainParams.sampleSize} />
          </Form.Group>
          <button className="cardAction" onClick={train}>
            <VscGear className="settingsIcon" />
            {trainModelText} &nbsp;
            {trainModelText == 'Training' ? (
              <PulseLoader size={5} color={'white'} />
            ) : null}
            {trainModelText == 'Trained' ? <FaCheckCircle></FaCheckCircle> : null}
            {trainModelText == 'Failed' ? (
              <FaExclamationCircle></FaExclamationCircle>
            ) : null}
          </button>
        </Form>

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
