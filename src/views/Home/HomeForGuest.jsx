import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeForGuest() {
  const navigate = useNavigate();
  
  const handleGoToLogin = () => {
    navigate(`/login`);
  }

  return (
    <div>
      <div>HomeForGuest</div>
      <button onClick={handleGoToLogin}>로그인</button>


    </div>
  )
}
