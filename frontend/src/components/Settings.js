import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import PulseLoader from 'react-spinners/PulseLoader';
import '../styles/settings.css';
import * as tf from '@tensorflow/tfjs';

function Settings() {
  const navigate = useNavigate();

  const [fetchText, setFetchText] = useState('Fetch');
  const [uploadText, setUploadText] = useState('Upload');
  const [messageCount, setMessageCount] = useState(10);
  const [fetchModelText, setFetchModelText] = useState('Fetch Model');
  const [model, setModel] = useState(null);

  const onSlide = (value) => {
    setMessageCount(value);
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  async function loadModel() {
    setFetchModelText('Fetching');
    const model = await tf.loadLayersModel('/api/download/model.json');
    model.summary();
    setModel(model);
    setFetchModelText('Fetched');
  }

  async function fetching() {
    if (fetchText == 'Fetch') {
      setFetchText('Fetching');
      //call to get more messages
      await timeout(800); //for 1 sec delay
      navigate('/');
    }
  }

  async function uploading() {
    if (uploadText == 'Upload' && model) {
      setUploadText('Uploading');
      //await timeout(3000).then(() => setUploadText('Uploaded'));
      //call to upload model
      //await model.save(window.location.origin + '/api/model', head);
      await model.save(
        tf.io.http(window.location.origin + '/api/model', {
          requestInit: {
            method: 'POST',
            headers: {
              numMessages: 130,
              trainLoss: 1.03,
              trainAcc: 94.32,
            },
          },
        })
      );
      setUploadText('Uploaded');
    }
  }

  return (
    <div className="container">
      <a href="/" className="backText">
        <FaArrowLeft style={{ marginBottom: '-2px' }}></FaArrowLeft>
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
    </div>
  );
}

export default Settings;
