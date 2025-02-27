import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import DoneScreen from './DoneScreen';
import QuestionForm from './QuestionForm';

export default function Question() {
    // 요청상태: idle/loading/done/error
    const [requestStatus, setRequestStatus] = useState("idle");
    const [responseData, setResponseData] = useState(null);

    // 폼 관련 state
    const [visibleSections, setVisibleSections] = useState(0);
    const [isActive, setActive] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [mcqCount, setMcqCount] = useState(10);
    const [shortCount, setShortCount] = useState(10);
    const [essayCount, setEssayCount] = useState(0);
    const totalLimit = 20;
    const [difficulty, setDifficulty] = useState("중");
    const [message, setMessage] = useState('');

    /* 파일 업로드 핸들러들 */
    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => { // 드롭 이벤트
        e.preventDefault();
        setActive(false);
        const uploadedFile = e.dataTransfer.files[0];
        if (uploadedFile) {
            if (uploadedFile.type === "application/pdf") { // 확장자 검사
                setFile(uploadedFile);
                setFileName(uploadedFile.name);
                console.log("업로드된 파일: ", uploadedFile);
            } else {
                setFile(null);
                setFileName('');
                console.error("잘못된 파일 형식: ", uploadedFile.type);
            }
        }
    }
    const handleFileChange = (e) => { // 클릭 이벤트
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setFileName(uploadedFile.name);
            console.log("업로드된 파일: ", uploadedFile);
        }
    }

    /* 문제 개수 합이 20을 초과하지 않도록 제어 */
    const handleCountChange = (e, type) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) return;
    
        // 현재 입력값들을 복사
        let newMcq = mcqCount;
        let newShort = shortCount;
        let newEssay = essayCount;
        if (type === "mcq") {newMcq = value;} 
        else if (type === "short") {newShort = value;} 
        else if (type === "essay") {newEssay = value;}
    
        if (newMcq + newShort + newEssay > totalLimit) {
          // 총합이 제한을 넘으면 아무런 변경도 하지 않거나, 사용자에게 알림 처리
          alert(`전체 문제 수는 ${totalLimit}개를 초과할 수 없습니다.`);
          return;
        }
    
        // 상태 업데이트
        if (type === "mcq") {setMcqCount(newMcq);} 
        else if (type === "short") {setShortCount(newShort);} 
        else if (type === "essay") {setEssayCount(newEssay);}
    };

    /* 난이도 라디오 변경 핸들러 */
    const handleDifficultyChange = (e) => setDifficulty(e.target.value);
    /* 추가 메세지 핸들러 */
    const handleMessageChange = (e) => setMessage(e.target.value);

    /* 문제 생성하기 버튼 핸들러 */
    const handleCreate = async () => {
        if (!file) {
            alert("파일을 첨부하세요");
            return;
        }

        setRequestStatus("loading");

        // 요청 데이터 
        const formData = new FormData();
        formData.append("file", file);
        [mcqCount, shortCount, essayCount].forEach(type => formData.append("types", type.toString()));
        formData.append("level", difficulty);
        formData.append("message", message || "");
        
        console.log("서버로 전송할 데이터:", formData);
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        
        // 요청
        // try {
        //     const user = JSON.parse(localStorage.getItem("user")) || {};
        //     const token = user.token;

        //     if (!token) {
        //         throw new Error("토큰이 없습니다.");
        //     }
                
        //     const response = await fetch("/questions/question", {
        //         method: "POST",
        //         headers: {
        //             "Authorization": `Bearer ${token}`  
        //         },
        //         body: formData
        //     });

        //     if (!response.ok) {
        //         throw new Error(`서버 에러: ${response.status}`);
        //     }
    
        //     const result = await response.json();

        //     if (result?.data?.projectList) {
        //         user.projectList = result.data.projectList;
        //         localStorage.setItem("user", JSON.stringify(user));
        //     } else {
        //         console.warn("projectList가 응답 데이터에 없습니다.");
        //     }

        //     console.log("서버 응답:", result);
        //     setResponseData(result);
        //     setRequestStatus("done");
        // } catch (error) {
        //     console.error("파일 업로드 실패:", error);
        //     setRequestStatus("error");
        // }

        // 테스트
        setTimeout(() => {
            const simulatedResponse = {
              success: true,
              message: "문제 생성 성공",
              data: {
                "currentProjectId" : 1,
                "projectList" : [
                    {
                        "projectId" : 1,
                        "projectName" : "클라우드"
                    },
                    {
                        "projectId" : 2,
                        "projectName" : "알고리즘"	
                    },
                    {
                        "projectId" : 3,
                        "projectName" : "사과"	
                    },
                    {
                        "projectId" : 4,
                        "projectName" : "펭구"	
                    },
                    {
                        "projectId" : 5,
                        "projectName" : "노란색"	
                    },
                    {
                        "projectId" : 6,
                        "projectName" : "힝"	
                    }
                ]
            }
            };

            const user = JSON.parse(localStorage.getItem("user")) || {};
            user.projectList = simulatedResponse.data.projectList;
            localStorage.setItem("user", JSON.stringify(user));
            window.dispatchEvent(new Event('storageChange'));

            setResponseData(simulatedResponse);
            setRequestStatus("done");
          }, 2000);

    };

    // 요청 상태에 따라 화면 전환
    if (requestStatus === "loading") return <LoadingScreen/>;

    if (requestStatus === "done") return <DoneScreen responseData={responseData}/>;

    if (requestStatus === "error") {
        return (
          <div className="errorScreen" style={{display:"flex", justifyContent:"center"}}>
            <p>오류가 발생했습니다. 다시 시도해주세요.</p>
          </div>
        );
    }
    
    return (
        <QuestionForm 
            fileName={fileName}
            isActive={isActive}
            handleFileChange={handleFileChange}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDragEnd={handleDragEnd}
            handleDrop={handleDrop}
            mcqCount={mcqCount}
            shortCount={shortCount}
            essayCount={essayCount}
            totalLimit={totalLimit}
            handleCountChange={handleCountChange}
            difficulty={difficulty}
            handleDifficultyChange={handleDifficultyChange}
            message={message}
            handleMessageChange={handleMessageChange}
            handleCreate={handleCreate}
            visibleSections={visibleSections}
        />
    );
}
