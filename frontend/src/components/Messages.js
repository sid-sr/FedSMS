/* eslint-disable react/jsx-key */
/* eslint-disable indent */
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import '../styles/messages.css';

const Messages = ({ title, messages = [] }) => {
  let navigate = useNavigate();
  const diplayMessage = (mes, index) => {
    navigate('/message', {
      state: {
        message: mes.message,
        spam: mes.spam,
        index: index,
        page: title,
        name: mes.name,
        time: mes.time,
      },
    });
  };

  const getTime = (givenTime) => {
    const date = new Date(givenTime);
    const today = new Date();
    const DAY = 24 * 3600 * 1000;

    const padding = (num) => ('0' + num).slice(-2);
    const diff = today.getTime() - givenTime;
    let displayTime = '';

    if (diff < DAY) {
      displayTime = `${padding(date.getHours() % 12)}:${padding(
        date.getMinutes()
      )} ${date.getHours() < 12 ? ' AM' : ' PM'}`;
    } else if (diff < 2 * DAY) {
      displayTime = 'Yesterday';
    } else {
      displayTime = `${padding(date.getDate())}/${padding(
        date.getMonth() + 1
      )}/${date.getFullYear() % 100}`;
    }
    return displayTime;
  };

  let newShort;
  return (
    <div className="container">
      <a href="/home" className="backText">
        <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        <span>Back</span>
      </a>
      <h1 className="settingsHeading">{title}</h1>
      <hr className="divider" />
      <div className="homeCards">
        <hr className="div4"></hr>
        {messages
          ? Object.values(messages).map((mes, index) => {
              const short = (mes.message || '').substring(0, 77);
              if (mes.message.length >= 77) {
                newShort = short.concat('...');
              } else {
                newShort = mes.message;
              }
              const time = getTime(mes.time);
              return (
                <div
                  key={index}
                  onClick={() => {
                    diplayMessage(mes, index);
                  }}
                >
                  <FaUserCircle
                    size={38}
                    style={{
                      marginBottom: '1px',
                      marginTop: '7px',
                      color: '#D1D3D4',
                      marginLeft: '-10px',
                      float: 'left',
                    }}
                  ></FaUserCircle>
                  <span style={{ fontSize: '14px', marginLeft: '16px' }}>
                    {mes.name}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      float: 'right',
                      marginRight: '10px',
                      marginTop: '3px',
                      color: '#7a7979',
                    }}
                  >
                    {time}
                  </span>
                  <span
                    style={{
                      float: 'right',
                      marginRight: '-80px',
                      marginTop: '-2px',
                      color: '#7a7979',
                    }}
                  >
                    <IoIosArrowForward
                      style={{
                        float: 'right',
                        marginRight: '8px',
                        marginTop: '6px',
                      }}
                    ></IoIosArrowForward>
                  </span>
                  <hr className="div3"></hr>
                  <div className="newHome">
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#7a7979',
                        lineHeight: '9pt',
                      }}
                    >
                      {newShort}
                    </span>
                  </div>
                  <hr className="div2"></hr>
                </div>
                //</div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Messages;
