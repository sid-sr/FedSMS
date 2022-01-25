/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { AiFillCamera } from 'react-icons/ai';
import { RiSpam2Line, RiAppStoreFill } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import TextField from '@mui/material/TextField';
import '../styles/message.css';
import db from '../utils/db';

const Message = () => {
  const { state } = useLocation();
  const [spam, setSpam] = useState();

  useEffect(() => {
    setSpam(state.spam);
  }, []);

  const toggleSpam = () => {
    db.messages.update(state.index + 1, { spam: !spam }).then(function () {
      setSpam(!spam);
    });
  };

  const getTime = () => {
    var milliseconds = state ? state.time : '';
    var day = new Date(milliseconds);
    var getDay = day.toUTCString().split(' ');
    var time = day.toLocaleTimeString().split(':');
    var today = new Date().toLocaleDateString();
    var date = day.toLocaleDateString();
    var tm = '';
    var yest = new Date(Date.now() - 864e5);
    yest = yest.toDateString().split(' ');
    var combinedate = yest[2] + '/' + yest[1] + '/' + yest[3];
    var newGetDay = getDay[1] + '/' + getDay[2] + '/' + getDay[3];
    var newTime;
    if (time[0] > 12) {
      time[0] = time[0] - 12;
      newTime = time[0] + ':' + time[1];
      newTime = newTime.concat(' PM');
    } else if (time[0] == 12) {
      newTime = time[0] + ':' + time[1];
      newTime = newTime.concat(' PM');
    } else if (time[0] < 12) {
      newTime = time[0] + ':' + time[1];
      newTime = newTime.concat(' AM');
    }
    if (today == date) {
      tm = tm.concat('Today, ', newTime);
    } else if (combinedate == newGetDay) {
      tm = tm.concat('Yesterday, ', newTime);
    } else {
      tm = getDay[0] + ' ' + getDay[1] + ' ' + getDay[2] + ',' + ' ' + newTime;
    }

    return tm;
  };
  return (
    <div className="container">
      <div className="home">
        {state.page == 'Junk' ? (
          <a href="/junk" className="back">
            <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
          </a>
        ) : (
          <a href="/allmessages" className="back">
            <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
          </a>
        )}
        <FaUserCircle
          className="Logo"
          size={50}
          style={{ marginBottom: '2px', color: '#D1D3D4' }}
        ></FaUserCircle>
        <span
          className="Name"
          style={{
            marginTop: '5px',
            fontSize: '12.5px',
          }}
        >
          {state ? state.name : ''}
          <IoIosArrowForward
            style={{ color: '#D1D3D4', marginLeft: '2px' }}
          ></IoIosArrowForward>
        </span>
      </div>
      <br></br>
      <div style={{ textAlign: 'center', fontSize: '0' }}>
        <span
          style={{
            color: '#7a7979',
            fontSize: '10px',
            display: 'inline-block',
            marginBottom: '-1px',
            marginTop: '-10px',
          }}
        >
          Text Message
        </span>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0' }}>
        <span
          style={{
            color: '#7a7979',
            fontSize: '10px',
          }}
        >
          {getTime()}
        </span>
      </div>
      <div className="homeNew">
        <span>{state ? state.message : ''}</span>
      </div>
      <p className="redtext">
        {' '}
        {spam ? (
          <>
            <RiSpam2Line style={{ fontSize: '16px' }}></RiSpam2Line>
            <span style={{ marginLeft: '10px' }}>Marked as spam.</span>
            <button
              style={{
                marginLeft: '3px',
                color: '#007aff',
                backgroundColor: 'black',
                border: 'none',
              }}
              onClick={toggleSpam}
            >
              Unmark
            </button>
          </>
        ) : (
          <>
            <button
              style={{
                marginLeft: '3px',
                color: 'red',
                backgroundColor: 'black',
                border: 'none',
              }}
              onClick={toggleSpam}
            >
              <RiSpam2Line style={{ fontSize: '16px' }}></RiSpam2Line>&nbsp;
              Mark as spam
            </button>
          </>
        )}
      </p>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        style={{ color: 'blue' }}
      />
      <div>
        <p className=".textCard"></p>
      </div>
      <AiFillCamera
        size={35}
        style={{ position: 'absolute', bottom: '15', color: '#7a7979' }}
      ></AiFillCamera>
      <RiAppStoreFill
        size={35}
        style={{
          position: 'absolute',
          bottom: '15',
          color: '#7a7979',
          marginLeft: '50px',
        }}
      ></RiAppStoreFill>

      <div className="getText">
        <input
          type="text"
          style={{
            width: '210px',
            borderRadius: '1.5em',
            height: '40px',
            backgroundColor: 'black',
            borderColor: '#7a7979',
          }}
          placeholder="  Text Message"
        ></input>
      </div>
      <BsFillArrowUpCircleFill
        size={30}
        style={{
          color: 'green',
          float: 'right',
          marginLeft: '84%',
          position: 'absolute',
          bottom: '15px',
        }}
      ></BsFillArrowUpCircleFill>
    </div>
  );
};

export default Message;
