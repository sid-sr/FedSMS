import { IoIosArrowBack } from 'react-icons/io';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/message.css';

const EachMessage = (props) => {
  return (
    <div className="container">
      <div className="home">
        <a href="/DisplayMessages" className="back">
          <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        </a>
        <span>{props.data}</span>
        <FaUserCircle
          className="Logo"
          size={50}
          style={{ marginBottom: '2px', color: '#D1D3D4' }}
        ></FaUserCircle>
      </div>
      <br></br>
      <br></br>
      <div className="homeNew"></div>
    </div>
  );
};

export default EachMessage;
