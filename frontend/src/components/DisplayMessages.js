/* eslint-disable react/jsx-key */
/* eslint-disable indent */
/ eslint-disable indent/;
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import '../styles/display.css';
import EachMessage from './EachMessage';

function Display() {
  const [fetchMessage, setFetchMessage] = useState({
    message: {
      someRandomQueryParam: [],
    },
  });

  const getMessage = () => {
    axios
      .get('/api/message')
      .then((response) => {
        toast.success('Messages Fetched');
        setFetchMessage(response.data);
        // console.log(response.data);
      })
      .catch((err) => {
        toast.error('Error Retrieving Messages!');
        console.error(err.toString());
      });
  };

  useEffect(() => {
    getMessage();
  }, []);
  const data = 'hi';

  return (
    <div className="container">
      <a href="/home" className="backText">
        <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        <span>Filters</span>
      </a>
      <h1 className="settingsHeading">Messages</h1>
      <hr className="divider" />
      {/* </div><div className="homeCard">
        <a href="/" className="nextMessage">
          <FaUserCircle
            size={38}
            style={{ marginBottom: '2px', color: '#D1D3D4' }}
          ></FaUserCircle> */}
      <div className="homeCard">
        {fetchMessage
          ? Object.values(fetchMessage).map((mes, index) => {
              const short = (mes.message || '').substring(0, 38);
              return (
                <div key={index}>
                  {/* <br /> */}
                  <a href="/EachMessage" className="nextMessage" key={index}>
                    <FaUserCircle
                      size={38}
                      style={{ marginBottom: '2px', color: '#D1D3D4' }}
                    ></FaUserCircle>
                    <span
                      style={{
                        marginLeft: '15px',
                        fontSize: '15px',
                        color: '#7a7979',
                        float: 'center',
                      }}
                    >
                      {short}
                    </span>
                    <a href="/EachMessage" style={{ marginLeft: '20px' }}></a>
                    <EachMessage data={data} />
                    <a href="/EachMessage" className="next">
                      <IoIosArrowForward></IoIosArrowForward>
                    </a>
                  </a>
                  <hr className="divider2"></hr>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
export default Display;
