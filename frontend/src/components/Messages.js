/* eslint-disable react/jsx-key */
/* eslint-disable indent */
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import '../styles/messages.css';

const Messages = ({ title = 'Messages', messages = [] }) => {
  let navigate = useNavigate();
  const diplayMessage = (mes) => {
    navigate('/message', {
      state: {
        message: mes.message,
        spam: mes.spam,
      },
    });
  };

  return (
    <div className="container">
      <a href="/home" className="backText">
        <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        <span>Back</span>
      </a>
      <h1 className="settingsHeading">{title}</h1>
      <hr className="divider" />
      <div className="homeCard">
        {messages
          ? Object.values(messages).map((mes, index) => {
              const short = (mes.message || '').substring(0, 29);
              return (
                <div key={index} onClick={() => diplayMessage(mes)}>
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
                  <div className="next">
                    <IoIosArrowForward></IoIosArrowForward>
                  </div>
                  <hr className="div2"></hr>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Messages;
