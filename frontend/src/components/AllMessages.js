/* eslint-disable react/jsx-key */
/* eslint-disable indent */
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Messages from './Messages';

const AllMessages = () => {
  const [fetchMessage, setFetchMessage] = useState([]);

  const getMessage = () => {
    axios
      .get('/api/message')
      .then((response) => {
        toast.success('Messages Fetched');
        setFetchMessage(response.data);
      })
      .catch((err) => {
        toast.error('Error Retrieving Messages!');
        console.error(err.toString());
      });
  };

  useEffect(() => {
    getMessage();
  }, []);

  return <Messages messages={fetchMessage} title="Messages" />;
};

export default AllMessages;
