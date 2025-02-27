import React from 'react';
import Lottie from "lottie-react";
import loadingLottie from '../../assets/loadingLottie.json';
import './LoadingScreen.css';

export default function LoadingScreen() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user.username;

    return (
        <div className="loadingScreen">
            <div className='lottieContainer'>
                <Lottie className='lottie' animationData={loadingLottie}/>
            </div>
            <div className='loadingMessage'>
                조금만 기다려 주세요! {username}님을 위한 문제를 정리하고 있어요 ✨
            </div>
        </div>
    );
}