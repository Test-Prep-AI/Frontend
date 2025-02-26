import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from "../views/Login";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="homeContainer">
          <div className="homeLeft">
            nav
          </div>
          <div className="homeCard">
            <Routes>
              <Route path="/login" element={<Login />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
