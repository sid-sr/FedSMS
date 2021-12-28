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
  const [messageCount, setMessageCount] = useState(10);
  const [fetchModelText, setFetchModelText] = useState('Fetch Model');
  const [trainModelText, setTrainModelText] = useState('Train Model');
  const [trainStats, setTrainStats] = useState({
    numMessages: 0,
    trainLoss: 0,
    trainAcc: 0,
  });
  const [model, setModel] = useState(null);
  const [trained, setTrained] = useState(false);

  const onSlide = (value) => {
    setMessageCount(value);
  };

  useEffect(() => {
    const tr = localStorage.getItem('TRAINED');
    if (tr === null || tr === undefined) {
      localStorage.setItem('TRAINED', false);
      setTrained(false);
    } else {
      setTrained(tr);
    }
  }, []);

  async function loadModel() {
    setFetchModelText('Fetching');
    const model = await loadModelFromURL('/api/download/model.json');
    setModel(model);
    setFetchModelText('Fetched');
  }

  async function train() {
    if (trainModelText == 'Train') {
      setTrainModelText('Training');
      const messages = await db.messages.toArray();
      const stats = await trainModel(messages, model, 3, 32);
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
          console.log(`Added ${res.data.length} messages to IndexedDB`);
          db.messages.bulkAdd(res.data);
          setFetchText('Fetched');
        })
        .catch((err) => {
          console.error(err.toString());
        });
    }
  }

  async function uploading() {
    if (uploadText == 'Upload') {
      if (!model || !trained) return;
      setUploadText('Uploading');
      await saveModel(model, window.location.origin + '/api/model', trainStats);
      setUploadText('Uploaded');
    }
  }

  return (
    <div className="container">
      <a href="/" className="backText">
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
      <h3 className="cardHeading">Tests</h3>
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
        {/* {JSON.stringify(trainStats)} */}
      </div>
    </div>
  );
}

export default Settings;
