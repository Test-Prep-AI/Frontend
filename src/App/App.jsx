import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  // 초기 로그인 상태 설정
  useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      setis_login(!!user); // user가 있으면 true, 없으면 false
  }, []);

  // localStorage 변경 시 로그인 상태 업데이트 (custom 이벤트 "storageChange")
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      setis_login(!!user);
    };

    window.addEventListener('storageChange', handleStorageChange);
    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
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
              <Route path="/login" element={is_login?<Navigate to="/" replace />:<Login />} />
              <Route path="/question" element={<PrivateRoute element={<Question />} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
