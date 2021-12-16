import { useState, useEffect } from 'react';
import '../styles/admin.css';

const AdminDash = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig({
      modelIndex: 0,
      strategy: 'qfedavg',
      fraction: 0.4,
      roundsCompleted: 0,
      clients: 5,
      globalLoss: [],
      globalAcc: [],
      averageClientAcc: [],
      averageClientLoss: [],
      qfedAvg_q: 0.1,
      qfedAvg_l: 1,
    });
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>
      {config ? JSON.stringify(config) : null}
    </div>
  );
};

export default AdminDash;
