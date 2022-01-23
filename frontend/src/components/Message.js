/* eslint-disable indent */
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { RiSpam2Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import '../styles/message.css';

const Message = () => {
  const { state } = useLocation();

  const toggleSpam = () => {};

  return (
    <div className="container">
      <div className="home">
        <a href="/allmessages" className="back">
          <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        </a>
        <FaUserCircle
          className="Logo"
          size={50}
          style={{ marginBottom: '2px', color: '#D1D3D4' }}
        ></FaUserCircle>
      </div>
      <br></br>
      <br></br>
      <div className="homeNew">
        <span>{state ? state.message : ''}</span>
      </div>
      <p className="redtext">
        {' '}
        {state.spam ? (
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
          ''
        )}
      </p>
      <div>
        <p className=".textCard"></p>
      </div>
    </div>
  );
};

export default Message;
