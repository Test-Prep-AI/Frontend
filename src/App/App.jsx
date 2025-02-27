import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import PrivateRoute from '../_Pageroute/PrivateRoute'; 
import Login from "../views/Login/Login";
import HomeForGuest from '../views/Home/HomeForGuest';
import HomeForLoggedIn from '../views/Home/HomeForLoggedIn';
import NavForGuest from '../views/Nav/NavForGuest';
import NavForLoggedIn from '../views/Nav/NavForLoggedIn';
import Question from '../views/Question/Question';
import './App.css';

function App() {
  const [is_login, setis_login] = useState(false);
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setis_login(!!user); // user가 있으면 true, 없으면 false
    }, []);

  return (
    <Router>
      <div className="app">
        <div className="homeContainer">
          <div className="homeLeft">
            { is_login? <NavForLoggedIn/> : <NavForGuest/>}
          </div>
          <div className="homeCard">
            <Routes>
              <Route path="/" element={is_login ? <HomeForLoggedIn /> : <HomeForGuest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/question" element={<PrivateRoute element={<Question />} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
