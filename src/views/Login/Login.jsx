import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { IS_FAKE_MODE, API_BASE_URL } from '../../config';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if (!IS_FAKE_MODE) { // 실제 요청 로직
            try {
                const response = await fetch(
                    `${API_BASE_URL}/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            useremail: email,
                            password: password,
                        }),
                    }
                );
        
                const result = await response.json();
        
                if (response.status === 200) {
                    const userData = {
                        token: result.accessToken
                    };
                    localStorage.setItem("user", JSON.stringify(userData)); // token, username, projectList
                    console.log("로그인 성공");

                    const token = userData.token;
                    const infoResponse = await fetch(
                        `${API_BASE_URL}/user/info`, 
                        {
                        method: "GET",
                        headers: {
                            "Authorizaton": `Bearer ${token}`
                        }
                    });
                    if (!infoResponse.ok) {
                        throw new Error(`User info fetch error: ${infoResponse.status}`);
                    }
                    const infoResult = await infoResponse.json();

                    // localstorage 업데이트
                    const user = JSON.parse(localStorage.getItem("user")) || {};
                    user.username = infoResult.data.username;
                    user.projectList = infoResult.data.projectList;
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // 변경 사항을 알리기 위한 custom 이벤트 발생
                    window.dispatchEvent(new Event("storageChange"));
                    navigate("/");
                } else {
                    if (response.status === 404) {
                        setErrorMessage("없는 유저입니다."); // 없는 유저
                    } else if (response.status === 401) {
                        setErrorMessage("로그인에 실패했습니다."); // 비밀번호 오류
                    } else {
                        setErrorMessage("로그인에 실패했습니다."); // 기타 에러
                    }
                    console.error("로그인 실패: ", result);
                }
            } catch (error) {
                setErrorMessage("서버 오류가 발생했습니다.");
            }
        } 
        else { // 테스트용 로직
            const fakeUser = {
                email: "test",
                password: "123",
                username: "구름이",
                token: "fake-token-123",
                projectList: [
                    { projectId: 1, projectName: "네트워크" }, 
                    { projectId: 2, projectName: "알고리즘" },
                    { projectId: 3, projectName: "자바" }, 
                    { projectId: 4, projectName: "자바스크립트" },
                    { projectId: 5, projectName: "깃" }, 
                    { projectId: 6, projectName: "파이썬" }
                ]
            };
    
            // 이메일 & 비밀번호 확인
            if (email === fakeUser.email && password === fakeUser.password) {
                localStorage.setItem("user", JSON.stringify(fakeUser)); // 가짜 로그인 저장
                console.log("로그인 성공, 유저네임: " + fakeUser.username);
                window.dispatchEvent(new Event("storageChange"));
                navigate("/"); // 로그인 후 메인 페이지로 이동
            } else {
                setErrorMessage("이메일 또는 비밀번호가 틀렸습니다."); // 로그인 실패 메시지
            }
        }
    }

    return (
        <div className='login'> 
            <form name="loginForm" onSubmit={handleSubmit}>
                <div className='loginTitle'>
                    로그인
                </div>
                <div className='contentWrap'>
                    <div className='emailWrap'>
                        <div className='inputTitle'>이메일</div>
                        <div className='inputWrap'>
                            <input 
                                className='input' 
                                placeholder='example@gmail.com'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                    </div>
                    <div className='passwordWrap'>
                        <div className='inputTitle'>비밀번호</div>
                        <div className='inputWrap'>
                            <input 
                                className='input' 
                                placeholder='영문, 숫자, 특수문자 포함 8~16자' 
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className='errorMessageWrap'>
                        { errorMessage }
                    </div>
                </div>
                <div>
                    <button type="submit">로그인</button>
                </div>
            </form>
        </div>
    )
}
