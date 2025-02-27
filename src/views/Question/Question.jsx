import React, {useState} from 'react';
import './Question.css';

export default function Question() {
    const [isActive, setActive] = useState(false);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);

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

    return (
        <div className='question'>
            <div className='questionTitle'>
                <p>시험 준비가 어렵나요? Test Prep이 도와드릴게요!</p>
                <p class="subtitle">어떤 문제를 원하시나요?</p>
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
            <div class="settings-section">
                <div class="exam-type">
                    <span class="label">출제방식 (최대 20개)</span>
                    <div class="question-count">
                        <span>객관식</span>
                        <input type="number" value="10" min="0"/> 문제
                    </div>
                    <div class="question-count">
                        <span>단답형</span>
                        <input type="number" value="10" min="0"/> 문제
                    </div>
                    <div class="question-count">
                        <span>서술형</span>
                        <input type="number" value="0" min="0"/> 문제
                    </div>  
                </div>
                <div class="difficulty">
                    <span class="label">문제 난이도</span>
                    <div class="radio-group">
                        <label><input type="radio" name="difficulty"/> 상</label>
                        <label><input type="radio" name="difficulty" checked/> 중</label>
                        <label><input type="radio" name="difficulty"/> 하</label>
                    </div>
                </div>
            </div>
            <div class="extra-section">
                <p>추가로 고려해야 할 사항이 있을까요?</p>
                <div class="input-box">
                    <input type="text" placeholder="추가 사항 입력"/>
                </div>
            </div>
            <button class="edit-btn">
                문제 생성하기
            </button>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
            <div>
                df
            </div>
        </div>
    )
}
