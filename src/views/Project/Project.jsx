import React from 'react';
import { useParams } from 'react-router-dom';

export default function Project() {
    const { projectId } = useParams(); // url에서 projectId 추출
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const projectList = user.projectList || [];
    const project = projectList.find(p => p.projectId === parseInt(projectId, 10));


    return (
        <div className='project'>
            {project? (
                <>
                    <div>
                        <div>프로젝트: {project.projectName}</div>
                        <div>다운로드 버튼</div>
                    </div>
                    <div>얘가 스크롤 돼야함
                        <div className='questionCard'>
                            <div className='qustionContent'>
                                <div>왼쪽 화살표</div>
                                <div>문제 래퍼</div>
                                <div>오른쪽 화살표</div>
                            </div>
                            <div>정답 제출 버튼</div>
                        </div>
                        <div className='answerCard'>
                            <div>내용</div>
                        </div>
                    </div>
                </>
            ) : (
                <p>해당 프로젝트를 찾을 수 없습니다.</p>
            )
            }
        </div>
    )
}
