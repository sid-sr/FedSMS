import Dexie from 'dexie';

const db = new Dexie('FedDB');

db.version(1).stores({
  messages: '++',
});

export default db;
