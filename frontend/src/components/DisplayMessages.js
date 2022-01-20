/* eslint-disable react/jsx-key */
/* eslint-disable indent */
/ eslint-disable indent/;
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/display.css';

function Display() {
    const [fetchMessage, setFetchMessage] = useState({
        message: {
            someRandomQueryParam: [],
        },
    });
    let navigate = useNavigate();
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

    const diplayMessage = (mes) => {
        navigate('/EachMessage', { state: { message: mes.message } });
    }
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
            <div className="homeCard">
                {fetchMessage
                    ? Object.values(fetchMessage).map((mes, index) => {
                        const short = (mes.message || '').substring(0, 35);
                        return (
                            <div key={index} onClick={() => diplayMessage(mes)}>
                                {/* <br /> */}
                                <a className="nextMessage" key={index}>
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
                                    <IoIosArrowForward></IoIosArrowForward>
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
