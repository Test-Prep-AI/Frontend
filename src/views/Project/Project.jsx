import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Project.css';
import { IS_FAKE_MODE, API_BASE_URL } from '../../config';

export default function Project() {
  const { projectId } = useParams(); // URL에서 projectId 추출

  // localStorage의 projectList, 현재 프로젝트 정보
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const projectList = user.projectList || [];
  const project = projectList.find(p => p.projectId === parseInt(projectId, 10));

  // 문제 목록, 에러 상태
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState("");

  // 각 문제별 사용자의 입력 답안과 제출 결과를 객체로 관리 (키: problemId)
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  // 각 문제별 정답 보기 토글 상태 (키: problemId)
  const [visibleAnswers, setVisibleAnswers] = useState({});

  /* 문제 목록 불러오기 요청 */
  useEffect(() => {
    if (!project) return;

    if (!IS_FAKE_MODE) {
      fetch(`${API_BASE_URL}/problems/${projectId}`, {
        method: "GET",
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
          setProblems(result.data.problemList || []);
          console.log("문제 목록 저장 완료:", result.data.problemList);
        })
        .catch(err => {
          console.error("문제 목록 요청 실패:", err);
          setError("문제 목록을 불러오지 못했습니다.");
        });
    } else {
      setTimeout(() => {
        const fakeProblems = [
          {
            problemId: 1,
            problemTitle: "라우터에서 발생하는 문제는 무엇인가요?",
            problemType: "객관식",
            options: {
              a: "네트워크 향상",
              b: "공인IP 주소 절약",
              c: "라우팅 프로토콜 설정",
              d: "VLAN 구성"
            },
            answer: "a",
            description: "문제 설명입니다."
          },
          {
            problemId: 2,
            problemTitle: "단답형 문제 예시",
            problemType: "단답형",
            options: {},
            answer: "4계층",
            description: "OSI 7 계층 중 4계층입니다."
          },
          {
            problemId: 3,
            problemTitle: "서술형 문제 예시",
            problemType: "서술형",
            options: {},
            answer: "왜냐하면 네트워크가 안정되어야 하기 때문입니다.",
            description: ""
          },{
            problemId: 4,
            problemTitle: "라우터에서 발생하는 문제는 무엇인가요?",
            problemType: "객관식",
            options: {
              a: "네트워크 향상",
              b: "공인IP 주소 절약",
              c: "라우팅 프로토콜 설정",
              d: "VLAN 구성"
            },
            answer: "a",
            description: "문제 설명입니다."
          },
          {
            problemId: 5,
            problemTitle: "단답형 문제 예시",
            problemType: "단답형",
            options: {},
            answer: "4계층",
            description: "OSI 7 계층 중 4계층입니다."
          },
          {
            problemId: 6,
            problemTitle: "서술형 문제 예시",
            problemType: "서술형",
            options: {},
            answer: "왜냐하면 네트워크가 안정되어야 하기 때문입니다.",
            description: ""
          },
        ];
        setProblems(fakeProblems);
        console.log("문제 목록(테스트용) 저장 완료:", fakeProblems);
      }, 1000);
    }
  }, [projectId, IS_FAKE_MODE]);

  /* 다운로드 핸들러 (동일) */
  const handleDownload = async () => {
    if (!project) return;

    if (!IS_FAKE_MODE) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems/${projectId}/download`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });
        if (!response.ok) {
          throw new Error(`파일 다운로드 실패: ${response.status}`);
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "problems.pdf";
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
      setTimeout(() => {
        const fakeContent = "이것은 가짜 PDF 파일 내용입니다.\n문제 리스트, 정답 등이 들어있다고 가정!";
        const blob = new Blob([fakeContent], { type: "application/pdf" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
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

  // 정답 제출 공통 함수: 로컬스토리지 업데이트 및 custom 이벤트 발생
  const updateUserResults = (problem, answer, isCorrect) => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    if (!userData.answerList) userData.answerList = {};
    if (!userData.correctList) userData.correctList = {};

    const projKey = project.projectId;
    if (!userData.answerList[projKey]) userData.answerList[projKey] = [];
    if (!userData.correctList[projKey]) userData.correctList[projKey] = [];

    // 기존 제출 답 제거 후 추가
    userData.answerList[projKey] = userData.answerList[projKey].filter(
      (item) => item.problemId !== problem.problemId
    );
    userData.correctList[projKey] = userData.correctList[projKey].filter(
      (item) => item.problemId !== problem.problemId
    );

    userData.answerList[projKey].push({ problemId: problem.problemId, answer });
    userData.correctList[projKey].push({ problemId: problem.problemId, isCorrect });

    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("storageChange"));
  };

  /* 개별 문제에 대한 정답 제출 핸들러 */
  const handleSubmitAnswer = async (problem) => {
    const answer = answers[problem.problemId];
    if (!answer) {
      alert("답을 입력하세요.");
      return;
    }

    if (!IS_FAKE_MODE) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems/${projectId}/${problem.problemId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ answer })
        });
        if (!response.ok) {
          throw new Error(`서버 에러: ${response.status}`);
        }
        const result = await response.json();
        console.log("정답 제출 응답:", result);
        const isCorrect = result.data.isCorrect;

        updateUserResults(problem, answer, isCorrect);

        if (problem.problemType === "객관식" || problem.problemType === "단답형") {
          setResults(prev => ({ ...prev, [problem.problemId]: isCorrect ? "정답이 맞습니다." : "정답이 아닙니다." }));
        } else if (problem.problemType === "서술형") {
            setResults(prev => ({ ...prev, [problem.problemId]: "해설을 확인하세요." }));
        }
      } catch (err) {
        console.error("정답 제출 중 오류:", err);
        alert("정답 제출 중 오류가 발생했습니다.");
      }
    } else {
      setTimeout(() => {
        const isCorrect = problem.answer === answer;
        updateUserResults(problem, answer, isCorrect);
        if (problem.problemType === "객관식" || problem.problemType === "단답형") {
            setResults(prev => ({ ...prev, [problem.problemId]: isCorrect ? "정답이 맞습니다." : "정답이 아닙니다." }));
        } else if (problem.problemType === "서술형") {
            setResults(prev => ({ ...prev, [problem.problemId]: "정답을 확인하세요." }));
        }
      }, 1000);
    }
  };

  // 입력값 변경 핸들러
  const handleAnswerChange = (problemId, value) => {
    setAnswers(prev => ({ ...prev, [problemId]: value }));
  };

  // 정답 보기 토글 핸들러
  const toggleShowAnswer = (problemId) => {
    setVisibleAnswers(prev => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  if (!project) {
    return <p>해당 프로젝트를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="project-container">
      <div className="project-header">
        <div className="project-title">프로젝트: {project.projectName}</div>
        <button className="download-button" onClick={handleDownload} title="문제 파일 다운로드">
          <img src="/images/downloadicon.png" alt="download" style={{ width: "40px", height: "auto" }} />
        </button>
      </div>

      <div className="project-content">
        {problems.length > 0 ? (
          <div className="questionCardsContainer">
            {problems.map((problem) => (
              <div key={problem.problemId} className="questionCard">
                <div className="question-content">
                  <div className="question-wrapper">
                    <div className="problem-title">
                        문제 {problem.problemId}. {problem.problemTitle}
                    </div>
                    {problem.problemType === "객관식" ? (
                        <div className="problem-options">
                            {problem.options && Object.entries(problem.options).length > 0 ? (
                            Object.entries(problem.options)
                                .sort((a, b) => a[0].localeCompare(b[0]))
                                .map(([key, value]) => (
                                <label key={key} className="option-label">
                                    <input
                                    type="radio"
                                    name={`problem-${problem.problemId}`}
                                    value={key}
                                    checked={answers[problem.problemId] === key}
                                    className='radioStyle'
                                    onChange={(e) => handleAnswerChange(problem.problemId, e.target.value)}
                                    />
                                    {key}. {value}
                                </label>
                                ))
                            ) : (
                            <p>선택지가 없습니다.</p>
                            )}
                        </div>
                    ) : (
                        <div className="problem-input">
                            <input
                            type="text"
                            placeholder="정답 입력"
                            value={answers[problem.problemId] || ""}
                            onChange={(e) => handleAnswerChange(problem.problemId, e.target.value)}
                            />
                        </div>
                    )}
                  </div>
                </div>
                <div className="buttonWrap">
                    <button className="submit-answer-button" onClick={() => handleSubmitAnswer(problem)}>
                        정답 제출
                    </button>
                    <button className="show-answer-button" onClick={() => toggleShowAnswer(problem.problemId)}>
                        {visibleAnswers[problem.problemId] ? "숨기기" : "정답 보기"}
                    </button>
                </div>
                {results[problem.problemId] && (
                    <div className="submission-result">{results[problem.problemId]}</div>
                )}
                {visibleAnswers[problem.problemId] && (
                    <div className="answerCard">
                        <div>정답: {problem.answer}</div>
                        <div>해설: {problem.description}</div>
                    </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>문제가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
