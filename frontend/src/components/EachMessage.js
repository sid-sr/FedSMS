/* eslint-disable indent */
/ eslint-disable indent/;
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { RiSpam2Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
//import { BsThreeDotsVertical } from 'react-icons/bs';
import '../styles/message.css';
const EachMessage = () => {
  const { state } = useLocation();

  let newL = '';

  function myFunction() {
    if (state.spam == true) {
      newL = 'UnMarked.';
      return newL;
    } else {
      newL = 'Marked as Spam';
      return newL;
    }
  }
  return (
    <div className="container">
      <div className="home">
        <a href="/DisplayMessages" className="back">
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
                marginLeft: '10px',
                color: '#007aff',
                backgroundColor: 'black',
                border: 'none',
              }}
              onClick={() => {
                myFunction();
              }}
            >
              Unmark
            </button>
          </>
        ) : (
          ''
        )}
      </p>
      <div>
        <p className=".textCard">
          {/* <span style={{ marginLeft: '7px' }}>{newmessage}</span> */}
        </p>
        {/* </div> */}
      </div>
    </div>
  );
};

export default EachMessage;
