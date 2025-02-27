import React from 'react';
import './DoneScreen.css';

export default function DoneScreen({ responseData }) {
  return (
    <div className="done-screen">
      <p>응답이 완료되었습니다!</p>
      <pre>{JSON.stringify(responseData, null, 2)}</pre>
    </div>
  );
}