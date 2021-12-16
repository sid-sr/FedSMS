import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import AdminDash from './components/AdminDash';
import Settings from './components/Settings';
import './index.css';

const Routing = () => {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<AdminDash />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById('root')
);
