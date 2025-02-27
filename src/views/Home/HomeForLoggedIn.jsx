import React from 'react';
import './Home.css';

export default function HomeForLoggedIn() {
  return (
    <div className='homeLoggedIn'>
        <div className='titleMessage'>
            <p>시험 준비가 어렵나요?</p>
            <p>Test Prep이 도와드릴게요!</p>
        </div>
        <div className="subMessage">
            <p>왼쪽의</p>
            <img src='/images/createicon.png'/>
            <p>버튼을 눌러 문제를 생성하세요.</p>
        </div>
    </div>
  )
}
