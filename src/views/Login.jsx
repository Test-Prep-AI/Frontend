import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // // reset login status
    // useEffect(() => { 
    //     dispatch(userActions.logout());
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        const response = await fetch(
            "주소",
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
                token: result.token,
                username: result.username,
                projectList: result.projectList
            };
            localStorage.setItem("user", JSON.stringify(userData)); // token, username, projectList

            console.log("로그인 성공, 유저네임: " + result.username);
            navigate("/");
        } else {
            if (response.status === 404) {
                setErrorMessage("없는 유저입니다."); // 없는 유저
            } else if (response.status === 400) {
                setErrorMessage("비밀번호가 다릅니다."); // 비밀번호 오류
            } else {
                setErrorMessage("로그인에 실패했습니다."); // 기타 에러
            }
            console.error("로그인 실패: ", result);
        }
    }

    return (
        <div className='page'> 
            <form name="form" onSubmit={handleSubmit}>
                <div className='title'>
                    로그인
                </div>
                <div className='contentWrap'>
                    <div className='inputTitle'>이메일</div>
                    <div className='inputWrap'>
                        <input 
                            className='input' 
                            placeholder='example@gmail.com'
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className='inputTitle'>비밀번호</div>
                    <div className='inputWrap'>
                        <input 
                            className='input' 
                            placeholder='영문, 숫자, 특수문자 포함 8~16자를 입력해주세요.' 
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}/>
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
