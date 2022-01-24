/* eslint-disable react/jsx-key */
/* eslint-disable indent */
import { useEffect, useState } from 'react';
import db from '../utils/db';
import Messages from './Messages';

const Junk = () => {
  const [fetchMessage, setFetchMessage] = useState([]);

  async function getMessage() {
    const messages = await db.messages
      .filter(({ spam }) => spam == true)
      .toArray();
    setFetchMessage(messages);
  }

  useEffect(() => {
    getMessage();
  }, []);

  return <Messages messages={fetchMessage} title="Junk" />;
};

export default Junk;
