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

    // 문제 목록, 에러, 현재 문제 인덱스, 사용자 답안, 제출 결과 메시지
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState('');
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [submissionResult, setSubmissionResult] = useState("");

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
            .then(result => {
                // 응답 데이터에서 problemList 저장 (없으면 빈 배열)
                setProblems(result.data.problemList || []);
                console.log('문제 목록 저장 완료:', result.data.problemList);
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
                console.log('문제 목록(테스트용) 저장 완료:', fakeProblems);
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

    // 이전 문제로 이동
    const handlePrev = () => {
        setCurrentProblemIndex(prev => Math.max(prev - 1, 0));
        //
        //
    };
    // 다음 문제로 이동
    const handleNext = () => {
        setCurrentProblemIndex(prev => Math.min(prev + 1, problems.length - 1));
        //
        //
    };

    /* 정답 제출 핸들러 */
    const handleSubmitAnswer = async () => {
        if (!problems.length) return;

        const currentProblem = problems[currentProblemIndex];

        if (!userAnswer) {
            alert("답을 입력하세요.");
            return;
        }

        // 실제 요청 로직
        if (!IS_FAKE_MODE) {
            try {
                const response = await fetch(`${API_BASE_URL}/problems/${projectId}/${currentProblem.problemId}`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ answer: userAnswer })
                });
                if (!response.ok) {
                    throw new Error(`서버 에러: ${response.status}`);
                }
                const result = await response.json();
                console.log("정답 제출 응답:", result);
                const isCorrect = result.data.isCorrect;
            
                // localStorage의 user 객체 업데이트: answerList, correctList (프로젝트별)
                const userData = JSON.parse(localStorage.getItem("user")) || {};
                if (!userData.answerList) userData.answerList = {};
                if (!userData.correctList) userData.correctList = {};
            
                const projKey = project.projectId;
                if (!userData.answerList[projKey]) {
                    userData.answerList[projKey] = [];
                }
                if (!userData.correctList[projKey]) {
                    userData.correctList[projKey] = [];
                }
                // 기존에 제출한 답이 있다면 제거
                userData.answerList[projKey] = userData.answerList[projKey].filter(item => item.problemId !== currentProblem.problemId);
                userData.correctList[projKey] = userData.correctList[projKey].filter(item => item.problemId !== currentProblem.problemId);
            
                userData.answerList[projKey].push({ problemId: currentProblem.problemId, answer: userAnswer });
                userData.correctList[projKey].push({ problemId: currentProblem.problemId, isCorrect });
            
                localStorage.setItem("user", JSON.stringify(userData));
                window.dispatchEvent(new Event("storageChange"));
            
                // 객관식과 단답형 문제일 때만 결과 메시지 출력
                if (currentProblem.problemType === "객관식" || currentProblem.problemType === "단답형") {
                    setSubmissionResult(isCorrect ? "정답이 맞습니다." : "정답이 틀립니다.");
                }
            } catch (err) {
                console.error("정답 제출 중 오류:", err);
                alert("정답 제출 중 오류가 발생했습니다.");
            }
        } 
        // 테스트용 로직
        else {
            setTimeout(() => {
                // 가짜 응답: 현재 문제의 정답(currentProblem.answer)과 비교하여 정답 여부 결정
                const simulatedResponse = {
                  data: {
                    projectId: project.projectId,
                    problemId: currentProblem.problemId,
                    isCorrect: currentProblem.answer === userAnswer
                  },
                  code: 200,
                  message: "OK"
                };
                const isCorrect = simulatedResponse.data.isCorrect;
          
                // localStorage 업데이트: 프로젝트별 answerList, correctList
                const userData = JSON.parse(localStorage.getItem("user")) || {};
                if (!userData.answerList) userData.answerList = {};
                if (!userData.correctList) userData.correctList = {};
          
                const projKey = project.projectId;
                if (!userData.answerList[projKey]) userData.answerList[projKey] = [];
                if (!userData.correctList[projKey]) userData.correctList[projKey] = [];
          
                // 기존 제출한 답이 있다면 제거
                userData.answerList[projKey] = userData.answerList[projKey].filter(item => item.problemId !== currentProblem.problemId);
                userData.correctList[projKey] = userData.correctList[projKey].filter(item => item.problemId !== currentProblem.problemId);
          
                // 새 답 추가
                userData.answerList[projKey].push({ problemId: currentProblem.problemId, answer: userAnswer });
                userData.correctList[projKey].push({ problemId: currentProblem.problemId, isCorrect });
          
                localStorage.setItem("user", JSON.stringify(userData));
                window.dispatchEvent(new Event("storageChange"));
          
                // 객관식과 단답형 문제일 때만 결과 메시지 출력
                if (currentProblem.problemType === "객관식" || currentProblem.problemType === "단답형") {
                    setSubmissionResult(isCorrect ? "정답이 맞습니다." : "정답이 틀립니다.");
                }
            }, 1000);
        }
    };    


    if (!project) {
        return <p>해당 프로젝트를 찾을 수 없습니다.</p>;
    }

    // 현재 보여줄 문제
    const currentProblem = problems[currentProblemIndex];

    return (
        <div className='project-container'>
            <div className='project-header'>
                <div className='project-title'>프로젝트: {project.projectName}</div>
                <button className='download-button' onClick={handleDownload} title="문제 파일 다운로드">
                    <img src='/images/downloadicon.png' alt='download' style={{ width: "40px", height: "auto" }}/>
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="project-content">
                {problems.length > 0 ? (
                // 모든 문제 카드를 렌더링하고, 현재 문제만 active 클래스로 표시
                <div className="questionCardsContainer">
                    {problems.map((problem, index) => (
                    <div
                        key={problem.problemId}
                        className={`questionCard ${index === currentProblemIndex ? "active" : "inactive"}`}
                    >
                        <div className="question-content">
                        <div className="arrow-left" onClick={handlePrev}>{"<"}</div>
                        <div className="question-wrapper">
                            <div className="problem-title">
                            문제 {problem.problemId}. {problem.problemTitle}
                            </div>
                            {problem.problemType === "객관식" ? (
                            <div className="problem-options">
                                {problem.options.map((option, index) => {
                                const letter = String.fromCharCode(97 + index);
                                return (
                                    <label key={index} className="option-label">
                                    <input
                                        type="radio"
                                        name={`problem-${problem.problemId}`}
                                        value={letter}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                    />
                                    {letter}. {option}
                                    </label>
                                );
                                })}
                            </div>
                            ) : (
                            <div className="problem-input">
                                <input
                                type="text"
                                placeholder="정답 입력"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                />
                            </div>
                            )}
                        </div>
                        <div className="arrow-right" onClick={handleNext}>{">"}</div>
                        </div>
                        <button className="submit-answer-button" onClick={handleSubmitAnswer}>
                        정답 제출
                        </button>
                        {((problem.problemType === "객관식" || problem.problemType === "단답형") && submissionResult && index === currentProblemIndex) && (
                        <div className="submission-result">{submissionResult}</div>
                        )}
                    </div>
                    ))}
                </div>
                ) : (
                <p>문제가 없습니다.</p>
                )}

                <div className="answerCard">
                <div>정답</div>
                <div>해설</div>
                </div>
            </div>

        </div>
    )
}