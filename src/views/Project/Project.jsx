import React from 'react';
import { useParams } from 'react-router-dom';
import './Project.css';

export default function Project() {
    const { projectId } = useParams(); // url에서 projectId 추출
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const projectList = user.projectList || [];
    const project = projectList.find(p => p.projectId === parseInt(projectId, 10));


    if (!project) {
        return <p>해당 프로젝트를 찾을 수 없습니다.</p>;
    }
    return (
        <div className='project-container'>
            <div className='project-header'>
                <div className='project-title'>프로젝트: {project.projectName}</div>
                <button className='download-button'>
                    <img src='/images/downloadicon.png' alt='download' style={{ width: "50px", height: "auto" }}/>
                </button>
            </div>
            <div className='project-content'>
                {/* 질문 카드 */}
                <div className='questionCard'>
                    <div className='question-content'>
                        <div className='arrow-left'>{"<"}</div>
                        <div className='question-wrapper'>
                            문제 질문
                            체크 
                            답적는 칸
                        </div>
                        <div className='arrow-right'>{">"}</div>
                    </div>
                    <button className='submit-answer-button'>정답 제출</button>
                </div>
                {/* 정답 카드 */}
                <div className='answerCard'>
                    <div>
                        정답
                    </div>
                    <div>
                        해설
                    </div>
                </div>
            </div>
        </div>
    )
}
