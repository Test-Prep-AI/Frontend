import React, { useState, useEffect } from 'react';
import './NavForLoggedIn.css';

export default function NavForLoggedIn() {
    const [username, setUsername] = useState("");
    const [projectList, setProjectLists] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        if (user.username) {
            setUsername(user.username); 
        }
        if (user.projectList) {
            setProjectLists(user.projectList);
        }
    }, []);

    return (
        <div className='nav'>
            <div className='navContainer'>
                <div className='logoWrap'>
                    <img src='/logosmall.png' alt='logo' style={{ width: "70px", height: "auto" }}/>
                </div>
                <div className='profileWrap'>
                    <img src='/profile.png' alt='profile' style={{ width: "120px", height: "auto" }}/>
                    <div className='text'>{ username }</div>
                </div>
                <hr className='divider' />
                <div className='newWrap'>
                    <div className='text'>New</div>
                    <div className='createButton'>
                        <img src='/navcreateicon.png' alt='create' />
                    </div>
                </div>
                <hr className='divider' />
                <div className='listWrap'>
                    <div className='listtext'>Recents</div>
                    <div className='buttonList'>
                        {projectList.length > 0 && (
                            projectList.map((project, index) => (
                                <button key={index} className="navButton">
                                    {project.name}
                                </button>
                            ))
                        )}
                    </div>
                    <div className='logoutButton'>로그아웃</div>
                </div>
            </div>
        </div>
    )
}
