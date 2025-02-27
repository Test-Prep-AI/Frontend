import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Project.css';
import { IS_FAKE_MODE, API_BASE_URL } from '../../config';

export default function Project() {
    const { projectId } = useParams(); // url에서 projectId 추출

    // localStroage의 projectList, 현재 프로젝트 정보
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const projectList = user.projectList || [];
    const project = projectList.find(p => p.projectId === parseInt(projectId, 10));

    // 문제 목록
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState('');

    /* 문제 목록 불러오기 요청 */
    useEffect(() => {
        if (!project) return;

        // 실제 요청 로직
        if (!IS_FAKE_MODE) { 
            // 실제 백엔드에서 문제 목록 받아오기
            fetch(`${API_BASE_URL}/problems/${projectId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${user.token}`  
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`서버 에러: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 응답 데이터에서 problemList 저장 (없으면 빈 배열)
                setProblems(data.problemList || []);
                console.log('잘 저장함', data.problemList);
            })
            .catch(err => {
                console.error("문제 목록 요청 실패:", err);
                setError("문제 목록을 불러오지 못했습니다.");
            });
        } 
        // 테스트용 로직
        else {
            setTimeout(() => {
                const fakeProblems = [
                    {
                    problemId: 1,
                    problemTitle: "라우터에서 발생하는 문제는 무엇인가요?",
                    problemType: "객관식",
                    options: [
                        "네트워크 향상",
                        "공인IP 주소 절약",
                        "라우팅 프로토콜 설정",
                        "VLAN 구성"
                    ],
                    answer: "a",
                    description: "문제 설명입니다."
                    },
                    {
                    problemId: 2,
                    problemTitle: "단답형 문제 예시",
                    problemType: "단답형",
                    options: [],
                    answer: "4계층",
                    description: "OSI 7 계층 중 4계층입니다."
                    },
                    {
                    problemId: 3,
                    problemTitle: "서술형 문제 예시",
                    problemType: "서술형",
                    options: [],
                    answer: "왜냐하면 네트워크가 안정되어야 하기 때문입니다.",
                    description: ""
                    }
                ];
                setProblems(fakeProblems);
                console.log('잘 저장함', fakeProblems);
            }, 1000);
        }
    }, [projectId, IS_FAKE_MODE]);

    /* 다운로드 핸들러 */
    const handleDownload = async () => {
        if (!project) return;

        if (!IS_FAKE_MODE) {
            // 실제 백엔드로부터 파일 다운로드
            try {
                const response = await fetch(`${API_BASE_URL}/problems/${projectId}/download`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`파일 다운로드 실패: ${response.status}`);
                }
                // blob 형태로 응답 받기
                const blob = await response.blob();

                // 브라우저에서 다운로드 처리
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = "problems.pdf"; // 서버가 파일명을 내려주면 파싱하여 사용 가능
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

                console.log("파일 다운로드 완료");
            } catch (err) {
                console.error(err);
                alert("파일 다운로드 중 오류가 발생했습니다.");
            }
            } else {
            // 테스트용: 가짜 파일(예: PDF 텍스트)을 blob으로 만들어 다운로드 시뮬레이션
            setTimeout(() => {
                const fakeContent = "이것은 가짜 PDF 파일 내용입니다.\n문제 리스트, 정답 등이 들어있다고 가정!";
                // MIME 타입을 'application/pdf'로 지정 (실제로는 PDF가 아님)
                const blob = new Blob([fakeContent], { type: 'application/pdf' });

                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = "fake-problems.pdf"; 
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

                console.log("가짜 파일 다운로드 완료");
            }, 1000);
        }
    };


    if (!project) {
        return <p>해당 프로젝트를 찾을 수 없습니다.</p>;
    }

    return (
        <div className='project-container'>
            <div className='project-header'>
                <div className='project-title'>프로젝트: {project.projectName}</div>
                <button className='download-button' onClick={handleDownload} title="문제 파일 다운로드">
                    <img src='/images/downloadicon.png' alt='download' style={{ width: "40px", height: "auto" }}/>
                </button>
            </div>
            <div className='project-content'>
                {/* 질문 카드 */}
                <div className='questionCard'>
                    <div className='question-content'>
                        <div className='arrow-left'>{"<"}</div>
                        <div className='question-wrapper'>
                            <div>
                                문제
                            </div>
                            <div>
                                선택지
                            </div>
                            <div>
                                답 적는 칸
                                <input/>
                            </div>
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
