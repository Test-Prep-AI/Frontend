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
        
        const fakeUser = {
            email: "test",
            password: "123",
            username: "구름이",
            token: "fake-token-123",
            projectList: [
                { projetId: 1, name: "네트워크" }, 
                { projetId: 2, name: "알고리즘" },
                { projetId: 1, name: "자바" }, 
                { projetId: 2, name: "자바스크립트" },
                { projetId: 1, name: "깃" }, 
                { projetId: 2, name: "파이썬" }
            ]
        };

        // 이메일 & 비밀번호 확인
        if (email === fakeUser.email && password === fakeUser.password) {
            localStorage.setItem("user", JSON.stringify(fakeUser)); // 가짜 로그인 저장
            console.log("로그인 성공, 유저네임: " + fakeUser.username);
            navigate("/"); // 로그인 후 메인 페이지로 이동
        } else {
            setErrorMessage("이메일 또는 비밀번호가 틀렸습니다."); // 로그인 실패 메시지
        }

        // try {
        //     const response = await fetch(
        //         "/login",
        //         {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({
        //                 useremail: email,
        //                 password: password,
        //             }),
        //         }
        //     );
    
        //     const result = await response.json();
    
        //     if (response.status === 200) {
        //         const userData = {
        //             token: result.token,
        //             username: result.username,
        //             projectList: result.projectList
        //         };
        //         localStorage.setItem("user", JSON.stringify(userData)); // token, username, projectList
    
        //         console.log("로그인 성공, 유저네임: " + result.username);
        //         navigate("/");
        //     } else {
        //         if (response.status === 404) {
        //             setErrorMessage("없는 유저입니다."); // 없는 유저
        //         } else if (response.status === 400) {
        //             setErrorMessage("비밀번호가 다릅니다."); // 비밀번호 오류
        //         } else {
        //             setErrorMessage("로그인에 실패했습니다."); // 기타 에러
        //         }
        //         console.error("로그인 실패: ", result);
        //     }
        // } catch (error) {
        //     setErrorMessage("서버 오류가 발생했습니다.");
        // }
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
