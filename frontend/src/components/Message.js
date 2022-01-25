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

  const getTime = (givenTime) => {
    const date = new Date(givenTime);
    const today = new Date();

    const diff = today.getTime() - givenTime;
    const DAY = 24 * 3600 * 1000;
    let displayTime = '';

    const padding = (num) => ('0' + num).slice(-2);
    const time = `${padding(date.getHours() % 12)}:${padding(
      date.getMinutes()
    )} ${date.getHours() < 12 ? ' AM' : ' PM'}`;

    if (diff < DAY) {
      displayTime = `Today, ${time}`;
    } else if (diff < 2 * DAY) {
      displayTime = `Yesterday, ${time}`;
    } else {
      displayTime = `${padding(date.getDate())}/${padding(
        date.getMonth() + 1
      )}/${date.getFullYear() % 100}, ${time}`;
    }
    return displayTime;
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
          {getTime(state.time)}
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
