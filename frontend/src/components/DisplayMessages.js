/* eslint-disable react/jsx-key */
/* eslint-disable indent */
/ eslint-disable indent/;
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import '../styles/home.css';
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
        console.log(fetchMessage);
      })
      .catch((err) => {
        toast.error('Error Retrieving Messages!');
        console.error(err.toString());
      });
  };

  useEffect(() => {
    getMessage();
  }, []);

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

      {fetchMessage
        ? fetchMessage.map((mes, index) => {
            return (
              <div className="homeCard" key={index}>
                {/* <br /> */}
                <a href="/" className="nextMessage" key={index}>
                  <FaUserCircle
                    size={38}
                    style={{ marginBottom: '2px', color: '#D1D3D4' }}
                  ></FaUserCircle>
                  {mes.message}
                  <a href="/EachMessage" style={{ marginLeft: '20px' }}></a>
                  <a href="/EachMessage" className="next">
                    <IoIosArrowForward
                      style={{ marginBottom: '2px', marginLeft: '275px' }}
                    ></IoIosArrowForward>
                  </a>
                </a>
              </div>
            );
          })
        : null}
    </div>
  );
}
export default Display;
