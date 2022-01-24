/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { RiSpam2Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
// import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';
//import TextField from '@material-ui/core/TextField';
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

  // const getTime=()=>
  // {
  //   var milliseconds=state ? state.time : '';
  //   var day=new Date(milliseconds);

  // }
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
          style={{
            marginTop: '5px',
            float: 'left',
            marginLeft: '33%',
            fontSize: '13px',
          }}
        >
          {state ? state.name : ''}
          <IoIosArrowForward style={{ color: '#D1D3D4' }}></IoIosArrowForward>
        </span>
      </div>
      <br></br>
      <br></br>
      <span></span>
      <div className="homeNew">
        <span>{state ? state.message : ''}</span>
      </div>
      {/* <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          style={{ color: 'white' }}
        />
      </Box> */}
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
      <div>
        <p className=".textCard"></p>
      </div>
      <div className="OuterTextField">
        <div className="TextField">
          <BsFillArrowUpCircleFill
            size={30}
            style={{
              color: 'green',
              float: 'right',
              marginTop: '-15px',
              marginRight: '-10px',
            }}
          ></BsFillArrowUpCircleFill>
        </div>
      </div>
    </div>
  );
};

export default Message;
