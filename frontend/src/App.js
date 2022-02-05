import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiValue, setApiValue] = useState(null);

  useEffect(() => {
    axios
      .get('/api/hello')
      .then((res) => setApiValue(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to Fed SMS</p>
        <p>The API returned a value of &quot;{apiValue}&quot;.</p>
        <a href="/home">Go to home</a>
        <a href="/settings">Go to settings</a>
      </header>
    </div>
  );
}

export default App;
