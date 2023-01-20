import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';

export const ProtectedRoute = ({ route, children }) => {
    const location = useLocation()
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [cookies] = useCookies(['token']);
    if (!cookies.token && location.pathname !== '/' && !localUser) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    else if(["Ashh20x" ,  "omprakashMahua"].includes(localUser?.username) && location.pathname === '/admin'){
        return children;
    }
    else if((localUser?.available_budget === 0 || localUser?.available_budget === null) && location.pathname === '/campaign'){
        return <Navigate to="/dashboard" />;
    }
    else if(cookies.token && localUser && (location.pathname === '/' || location.pathname === '/admin')) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};