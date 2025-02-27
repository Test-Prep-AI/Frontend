import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute({ element }) {
    const user = JSON.parse(localStorage.getItem("user")); // 로그인 여부 확인

    return user ? element : <Navigate to="/login" replace />;
}