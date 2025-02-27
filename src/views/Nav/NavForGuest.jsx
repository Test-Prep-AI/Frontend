import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavForGuest.css';

export default function NavForGuest() {
  const navigate = useNavigate();
  const handleGoToHome = () => {
    navigate(`/`);
  }

  return (
    <div className='nav' style={{ display:"flex" }}>
      <img src='/images/logobig.png' className='logoImg' onClick={handleGoToHome}/>
    </div>
  )
}
