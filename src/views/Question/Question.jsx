import React, { useState, useEffect } from 'react';
import './Question.css';

export default function Question() {
    const [visibleSections, setVisibleSections] = useState(0);

    // 파일
    const [isActive, setActive] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    // 문제 개수 
    const [mcqCount, setMcqCount] = useState(10);
    const [shortCount, setShortCount] = useState(10);
    const [essayCount, setEssayCount] = useState(0);
    const totalLimit = 20;

    // 난이도
    const [difficulty, setDifficulty] = useState("중");

    // 추가메세지
    const [message, setMessage] = useState('');

    // 요청상태: idle/loading/done/error
    const [requestStatus, setRequestStatus] = useState("loading");
    const [responseData, setResponseData] = useState(null);


    /* 파일 업로드 핸들러들 */
    const handleDragStart = () => {setActive(true);}
    const handleDragEnd = () => {setActive(false);}

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
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

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setFileName(uploadedFile.name);
            console.log("업로드된 파일: ", uploadedFile);
        }
    }

    /* 스크롤 기능 디자인 */
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const container = document.querySelector(".question");
    //         const scrollTop = container.scrollTop;
    //         const maxScroll = container.scrollHeight - container.clientHeight;
    //         const percentage = (scrollTop / maxScroll) * 100;

    //         // 스크롤 진행률에 따라 점점 나타나도록 설정
    //         if (percentage > 5) setVisibleSections(1);
    //         if (percentage > 30) setVisibleSections(2);
    //         if (percentage > 60) setVisibleSections(3);
    //     };

    //     const container = document.querySelector(".question");
    //     // handleScroll();

    //     container.addEventListener("scroll", handleScroll);
    //     return () => container.removeEventListener("scroll", handleScroll);
    // }, []);


    /* 문제 개수 합이 20을 초과하지 않도록 제어 */
    const handleCountChange = (e, type) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) return;
    
        // 현재 입력값들을 복사합니다.
        let newMcq = mcqCount;
        let newShort = shortCount;
        let newEssay = essayCount;
    
        if (type === "mcq") {
          newMcq = value;
        } else if (type === "short") {
          newShort = value;
        } else if (type === "essay") {
          newEssay = value;
        }
    
        // 변경 후의 총합 계산
        const sum = newMcq + newShort + newEssay;
        if (sum > totalLimit) {
          // 총합이 제한을 넘으면 아무런 변경도 하지 않거나, 사용자에게 알림 처리
          alert(`전체 문제 수는 ${totalLimit}개를 초과할 수 없습니다.`);
          return;
        }
    
        // 상태 업데이트
        if (type === "mcq") {
          setMcqCount(newMcq);
        } else if (type === "short") {
          setShortCount(newShort);
        } else if (type === "essay") {
          setEssayCount(newEssay);
        }
    };

    /* 난이도 라디오 변경 핸들러 */
    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
    };

    /* 추가 메세지 입력 */
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };
    
    /* 문제 생성하기 버튼 */
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
        
        // 요청
        // try {
        //     const response = await fetch("/questions/question", {
        //         method: "POST",
        //         body: formData
        //     });
    
        //     const result = await response.json();
        //     console.log("서버 응답:", result);
        //     setResponseData(result);
        //     setRequestStatus("done");
        // } catch (error) {
        //     console.error("파일 업로드 실패:", error);
        //     setRequestStatus("error");
        // }

        setTimeout(() => {
            const simulatedResponse = {
              success: true,
              message: "문제 생성 성공",
              data: {
                fileName: fileName,
                types: [mcqCount, shortCount, essayCount],
                level: difficulty,
                message: message || ""
              }
            };
            setResponseData(simulatedResponse);
            setRequestStatus("done");
          }, 2000);

    };

    // 요청 상태에 따라 다른 화면 렌더링
    if (requestStatus === "loading") {
        return (
        <div className="loading-screen">
            <p>로딩중입니다...</p>
        </div>
        );
    }

    if (requestStatus === "done") {
        return (
          <div className="done-screen">
            <p>응답이 완료되었습니다!</p>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        );
    }

    if (requestStatus === "error") {
        return (
          <div className="error-screen">
            <p>오류가 발생했습니다. 다시 시도해주세요.</p>
          </div>
        );
    }
    

    return (
        <div className='question'>
            <div className='defaultSection' >
                <div className='questionTitle'>
                    <p>시험 준비가 어렵나요? Test Prep이 도와드릴게요!</p>
                    <p className="subtitle">어떤 문제를 원하시나요?</p>
                </div>
                <div className='uploadSection'>
                    <label htmlFor="fileUpload"
                        className={`uploadPreview${isActive ? ' active' : ''}`}  // isActive 값에 따라 className 제어
                        onDragEnter={handleDragStart}  // dragstart 핸들러 추가
                        onDragOver={handleDragOver}  // dragover 핸들러 추가
                        onDragLeave={handleDragEnd}  // dragend 핸들러 추가
                        onDrop={handleDrop}
                    >
                        <img src='/uploadicon.png' alt="파일 업로드" style={{ width: "90px", height: "auto" }}/>
                        <p className="uploadPreviewMessage">
                            {fileName ? `선택된 파일: ${fileName}` : "클릭 또는 드롭하여 pdf 파일을 업로드하세요."}
                        </p>
                    </label>
                    <input type="file" className="file" id='fileUpload' style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                </div>
            </div>

            {/* 아래 섹션들은 스크롤 시 점점 보이도록 설정 */}
            <div className={`settings-section fade-in ${visibleSections >= 1 ? 'visible' : ''}`}>
                <div className="exam-type">
                    <span className="label">출제방식 (최대 {totalLimit}개)</span>
                    <div className='count-group'>
                        <div className="question-count">
                            <span>객관식</span>
                            <input className='numberInput' type="number" value={mcqCount} min="0"
                                onChange={(e) => handleCountChange(e, "mcq")}/> 문제
                        </div>
                        <div className="question-count">
                            <span>단답형</span>
                            <input className='numberInput' type="number" value={shortCount} min="0"
                                onChange={(e) => handleCountChange(e, "short")}/> 문제
                        </div>
                        <div className="question-count">
                            <span>서술형</span>
                            <input className='numberInput' type="number" value={essayCount} min="0"
                                onChange={(e) => handleCountChange(e, "essay")}/> 문제
                        </div>  
                    </div>
                </div>
                <div className="difficulty">
                    <span className="label">문제 난이도</span>
                    <div className="radio-group">
                        <label htmlFor="radioHigh">
                            <input id="radioHigh" className='radioStyle' type="radio" name="difficulty" value="상"
                                onChange={handleDifficultyChange}/> 
                            상
                        </label>
                        <label htmlFor="radioMid">
                            <input id="radioMid"  className='radioStyle' type="radio" name="difficulty" value="중"
                                onChange={handleDifficultyChange} defaultChecked/> 
                            중
                        </label>
                        <label htmlFor="radioLow">
                            <input id="radioLow"  className='radioStyle' type="radio" name="difficulty" value="하"
                                onChange={handleDifficultyChange}/> 
                            하
                        </label>
                    </div>
                </div>
            </div>

            <div className={`extra-section fade-in ${visibleSections >= 2 ? 'visible' : ''}`}>
                <p>추가로 고려해야 할 사항이 있을까요?</p>
                <div className="input-box">
                    <input type="text" placeholder="추가 사항 입력" 
                        value={message} onChange={handleMessageChange}/>
                </div>
            </div>

            <button className={`edit-btn fade-in ${visibleSections >= 3 ? 'visible' : ''}`}
                onClick={handleCreate}>
                문제 생성하기
            </button>
        </div>
    )
}
