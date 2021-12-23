import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import '../styles/settings.css';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

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
  const [trainData, setTrainData] = useState([]);

  const onSlide = (value) => {
    setMessageCount(value);
  };

  async function loadModel() {
    setFetchModelText('Fetching');
    const model = await tf.loadLayersModel('/api/download/model.json');
    model.summary();
    model.compile({
      loss: 'binaryCrossentropy',
      optimizer: tf.train.adam(0.01), // This is a standard compile config
      metrics: ['accuracy'],
    });
    setModel(model);
    setFetchModelText('Fetched');
  }

  async function train() {
    setTrainModelText('Training');
    if (trainData.length === 0 || !model) return;
    const x_train = [],
      y_train = [];

    for (const row of trainData) {
      x_train.push(row['embedding']);
      y_train.push(1 * row['spam']);
    }

    const xs = tf.tensor2d(x_train, [
      trainData.length,
      trainData[0]['embedding'].length,
    ]);
    const ys = tf.tensor1d(y_train);

    await model.fit(xs, ys, {
      epochs: 1,
      batchSize: 32,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          console.log('Epoch: ' + epoch + ' Loss: ' + logs.loss);
        },
      },
    });
    const stats = model.evaluate(xs, ys);
    console.log(stats[0].dataSync()[0], stats[1].dataSync()[0]);
    setTrainStats({
      numMessages: trainData.length,
      trainLoss: Math.round(stats[0].dataSync()[0] * 1000) / 1000,
      trainAcc: Math.round(stats[1].dataSync()[0] * 100 * 100) / 100,
    });
    setTrainModelText('Trained');
  }

  async function fetching() {
    if (fetchText == 'Fetch') {
      setFetchText('Fetching');
      axios
        .get('/api/message')
        .then((res) => {
          setTrainData(res.data);
          console.log(trainData[0]);
          setFetchText('Fetched');
        })
        .catch((err) => {
          console.error(err.toString());
        });
    }
  }

  async function uploading() {
    if (uploadText == 'Upload' && model) {
      if (trainData.length === 0 || !model) return;
      setUploadText('Uploading');
      await model.save(
        tf.io.http(window.location.origin + '/api/model', {
          requestInit: {
            method: 'POST',
            headers: trainStats,
          },
        })
      );
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
        </button>
      </div>
    </div>
  );
}

export default Settings;
