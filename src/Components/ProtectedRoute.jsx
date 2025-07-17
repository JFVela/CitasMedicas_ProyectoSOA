// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(usuario.nombreRol)) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}