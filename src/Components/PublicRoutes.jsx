// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario ? <Navigate to={`/${usuario.nombreRol}`} /> : children;
}