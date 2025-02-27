import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function HomeForGuest() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate(`/login`);
  }

  return (
    <div className='homeGuest'>
      <div className='titleMessage'>
        <p>시험 준비가 어렵나요?</p>
        <p>Test Prep이 도와드릴게요!</p>
      </div>
      <div className='buttonWrap'>
        <button className='loginButton' onClick={handleGoToLogin}>로그인</button>
      </div>
    </div>
  )
}
