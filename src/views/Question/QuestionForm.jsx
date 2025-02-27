import React from 'react';
import './QuestionForm.css';

export default function QuestionForm({
  fileName,
  isActive,
  handleFileChange,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleDrop,
  mcqCount,
  shortCount,
  essayCount,
  totalLimit,
  handleCountChange,
  difficulty,
  handleDifficultyChange,
  message,
  handleMessageChange,
  handleCreate,
  visibleSections
}) {
    return (
        <div className='questionForm'>
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