import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState, useEffect } from 'react';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import '../styles/settings.css';
import axios from 'axios';
import db from '../utils/db';
import { trainModel, loadModelFromURL, saveModel } from '../utils/train';

function Settings() {
  const [fetchText, setFetchText] = useState('Fetch');
  const [uploadText, setUploadText] = useState('Upload');
  const [deleteText, setDeleteText] = useState('Clear DB');
  const [messageCount, setMessageCount] = useState(10);
  const [fetchModelText, setFetchModelText] = useState('Fetch Model');
  const [trainModelText, setTrainModelText] = useState('Train Model');
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

  const onSlide = (value) => {
    setMessageCount(value);
  };

  async function loadModel() {
    setFetchModelText('Fetching');
    const model = await loadModelFromURL('/api/download/model.json');
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
        <div>
          <Slider
            className="numberSlider"
            handleStyle={{
              borderColor: 'white',
              height: 20,
              width: 20,
              marginTop: -9,
              backgroundColor: 'white',
            }}
            min={5}
            max={100}
            defaultValue={10}
            trackStyle={{ backgroundColor: '#2E4FE1', height: 4 }}
            railStyle={{ backgroundColor: '#7a7979', height: 4 }}
            marks={{
              5: 5,
              10: 10,
              20: 20,
              30: 30,
              40: 40,
              50: 50,
              60: 60,
              70: 70,
              80: 80,
              90: 90,
              100: 100,
            }}
            step={null}
            onChange={onSlide}
            value={messageCount}
          />
        </div>
        <br />
        <hr className="divider2" />
        <button
          className="cardAction"
          style={{ marginTop: '5px' }}
          onClick={fetching}
        >
          {fetchText}&nbsp;
          {fetchText == 'Fetching' ? (
            <ClipLoader size={10} color={'white'} />
          ) : null}
        </button>
      </div>

      <br />
      <h3 className="cardHeading">Upload Model</h3>
      <div className="settingsCard">
        <button className="cardAction" onClick={uploading}>
          {uploadText} &nbsp;
          {uploadText == 'Uploading' ? (
            <PulseLoader size={5} color={'white'} />
          ) : null}
          {uploadText == 'Uploaded' ? <FaCheckCircle></FaCheckCircle> : null}
        </button>
      </div>
      <h3 className="cardHeading">Manual Tests</h3>
      <div className="settingsCard">
        <button className="cardAction" onClick={loadModel}>
          {fetchModelText} &nbsp;
          {fetchModelText == 'Fetching' ? (
            <PulseLoader size={5} color={'white'} />
          ) : null}
          {fetchModelText == 'Fetched' ? <FaCheckCircle></FaCheckCircle> : null}
        </button>
      </div>
      <div className="settingsCard">
        <button className="cardAction" onClick={train}>
          {trainModelText} &nbsp;
          {trainModelText == 'Training' ? (
            <PulseLoader size={5} color={'white'} />
          ) : null}
          {trainModelText == 'Trained' ? <FaCheckCircle></FaCheckCircle> : null}
          {trainModelText == 'Failed' ? (
            <FaExclamationCircle></FaExclamationCircle>
          ) : null}
        </button>
      </div>
      <div className="settingsCard">
        <button
          className="cardAction"
          // style={{ backgroundColor: '#CB4C4E' }}
          onClick={deleteMessages}
        >
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
