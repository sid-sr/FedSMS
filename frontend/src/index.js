import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import AdminDash from './components/AdminDash';
import Settings from './components/Settings';
import Home from './components/Home';
import AllMessages from './components/AllMessages';
import Junk from './components/Junk';
import Message from './components/Message';
import './index.css';

const Routing = () => {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/allmessages" element={<AllMessages />} />
        <Route path="/junk" element={<Junk />} />
        <Route path="/message" element={<Message />} />
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
