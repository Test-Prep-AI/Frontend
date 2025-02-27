import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavForLoggedIn.css';

export default function NavForLoggedIn() {
    const [username, setUsername] = useState("");
    const [projectList, setProjectList] = useState([]);
    const navigate = useNavigate();

    const updateUserData = () => {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        setUsername(user.username || "");
        setProjectList(user.projectList || []);
    };

    useEffect(() => {
        updateUserData();
        // custom event를 통해 localStorage 변경 감지
        window.addEventListener('storageChange', updateUserData);
        return () => {
          window.removeEventListener('storageChange', updateUserData);
        };
    }, []);

    /* 로그아웃 핸들러 */
    const handleLogout = () => {
        // 로컬 스토리지에서 user 삭제
        localStorage.removeItem("user");
        // custom event 발생시켜 다른 컴포넌트도 업데이트하도록 함
        window.dispatchEvent(new Event('storageChange'));
        // 페이지 새로고침 또는 원하는 경로로 이동
        navigate(`/`);
    };

    /* 문제생성 페이지로 이동 */
    const handleGoToQuestion = () => {
        navigate(`/question`);
    }
    /* 홈 페이지로 이동 */
    const handleGoToHome = () => {
        navigate(`/`);
    }

    /* 프로젝트 페이지로 이동 */
    const handleProject = (projectId) => {
        navigate(`/project/${projectId}`);
    }

    return (
        <div className='nav'>
            <div className='navContainer'>
                <div className='logoWrap' onClick={handleGoToHome}>
                    <img src='/images/logosmall.png' alt='logo' style={{ width: "70px", height: "auto" }}/>
                </div>
                <div className='profileWrap'>
                    <img src='/images/profile.png' alt='profile' style={{ width: "125px", height: "auto" }}/>
                    <div className='text'>{ username }</div>
                </div>
                <hr className='divider' />
                <div className='newWrap'>
                    <div className='text'>New</div>
                    <div className='createButton' onClick={handleGoToQuestion}>
                        <img src='/images/questionline.png' alt='question' style={{ width: "30px", height: "auto" }}/>
                    </div>
                </div>
                <hr className='divider' />
                <div className='listWrap'>
                    <div className='listtext'>Recents</div>
                    <div className='buttonList'>
                        {projectList.length > 0 && (
                            projectList.map((project, index) => (
                                <button key={index} className="navButton" onClick={() => handleProject(project.projectId)}>
                                    {project.projectName}
                                </button>
                            ))
                        )}
                    </div>
                    <div className='logoutButton' onClick={handleLogout}>로그아웃</div>
                </div>
            </div>
        </div>
    )
}
