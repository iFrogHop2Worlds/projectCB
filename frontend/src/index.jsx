/* eslint-disable prettier/prettier */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div id="app-wrapper">
        <Routes>
          <Route exact path="/" element={<App />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('app')
);
