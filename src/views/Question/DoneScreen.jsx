import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import successLottie from '../../assets/successLottie.json';
import './DoneScreen.css';

export default function DoneScreen({ responseData }) {
  const navigate = useNavigate();

  const handleGoToProject = () => {
    const projectId = responseData?.data?.currentProjectId;
    if (projectId) {
      navigate(`/project/${projectId}`);
    } else {
      console.log("프로젝트 ID가 없습니다.");
      navigate(`/question`);
    }
  }

  return (
    <div className="doneScreen">
        <div className='lottieContainer'>
          <Lottie className='lottie' animationData={successLottie}/>
        </div>
        <div className='successMessage'>
          문제 생성이 완료되었습니다!
        </div>
        <button className='moveButton' onClick={handleGoToProject}>
          문제 페이지로 이동하기
        </button>
    </div>
  );
}