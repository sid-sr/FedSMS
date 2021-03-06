/* eslint-disable react/jsx-key */
/* eslint-disable indent */
import { useEffect, useState } from 'react';
import db from '../utils/db';
import Messages from './Messages';

const AllMessages = () => {
  const [fetchMessage, setFetchMessage] = useState([]);

  async function getMessage() {
    const messages = await db.messages.toArray();
    messages.sort(function (a, b) {
      return b.time - a.time;
    });
    setFetchMessage(messages);
  }

  useEffect(() => {
    getMessage();
  }, []);

  return <Messages messages={fetchMessage} title="Messages" />;
};

export default AllMessages;
