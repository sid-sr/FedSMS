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
  let newShort;
  return (
    <div className="container">
      <a href="/home" className="backText">
        <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        <span>Back</span>
      </a>
      <h1 className="settingsHeading">{title}</h1>
      <hr className="divider" />
      <div className="homeCard">
        <hr className="div4"></hr>
        {messages
          ? Object.values(messages).map((mes, index) => {
              const short = (mes.message || '').substring(0, 77);
              if (mes.message.length >= 77) {
                newShort = short.concat('...');
              } else {
                newShort = mes.message;
              }
              var getTime = '';
              var shortDay;
              var date = new Date(mes.time);
              var time = date.toLocaleTimeString().split(':');
              var newTime = time[0] + ':' + time[1];
              var day = date.toUTCString().split(' ');
              if (day[2] == 'Jan') {
                shortDay = '01';
              } else if (day[2] == 'Feb') {
                shortDay = '02';
              } else if (day[2] == 'Mar') {
                shortDay = '03';
              }
              var getDay = day[1] + '/' + shortDay + '/' + day[3];
              var newGetDay =
                day[1] + '/' + shortDay + '/' + day[3].substring(2, 4);
              var daywithoutnumber = day[1] + '/' + day[2] + '/' + day[3];
              var today = new Date().toLocaleDateString();
              var dateobj = new Date();
              dateobj.setDate(dateobj.getDate() - 1);
              var newdate = new Date(Date.now() - 864e5);
              newdate = newdate.toDateString().split(' ');
              var combinedate =
                newdate[2] + '/' + newdate[1] + '/' + newdate[3];
              if (getDay == today) {
                if (time[0] <= 11) {
                  getTime = newTime.concat(' AM');
                } else {
                  getTime = newTime.concat(' PM');
                }
              } else if (daywithoutnumber == combinedate) {
                getTime = getTime.concat('Yesterday');
              } else {
                getTime = newGetDay;
              }
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
                    {getTime}
                  </span>
                  <span
                    style={{
                      float: 'right',
                      marginRight: '-80px',
                      marginTop: '-2px',
                      color: '#7a7979',
                    }}
                  >
                    <IoIosArrowForward></IoIosArrowForward>
                  </span>
                  <hr className="div3"></hr>
                  <div className="newHome">
                    <span
                      style={{
                        //marginLeft: '58px',
                        fontSize: '12px',
                        //height: '-20px',
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
