/* eslint-disable react/jsx-key */
/* eslint-disable indent */
/ eslint-disable indent/;
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import '../styles/message.css';

const EachMessage = () => {
    const { state } = useLocation();
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
        </div>
    );
};

export default EachMessage;
