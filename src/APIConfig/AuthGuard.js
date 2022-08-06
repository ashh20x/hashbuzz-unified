import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';

export const ProtectedRoute = ({ route, children }) => {
    const location = useLocation()
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [cookies, setCookie] = useCookies(['token']);
    if (!cookies.token && location.pathname !== '/' && !localUser) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    else if(localUser?.username?.toLowerCase() === "ashh20x" && location.pathname === '/admin'){
        return children;
    }
    else if(cookies.token && localUser && (location.pathname === '/' || location.pathname === '/admin')) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};