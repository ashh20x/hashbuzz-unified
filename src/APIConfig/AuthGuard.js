import { Navigate, useLocation, matchRoutes } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useCookies } from 'react-cookie';

export const ProtectedRoute = ({ route, children }) => {
    const location = useLocation()
    // console.log("location====",location)
    const localUser = localStorage.getItem('user');
    const [cookies, setCookie] = useCookies(['token']);
    if (!cookies.token && location.pathname !== '/' && !localUser) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    else if(cookies.token && location.pathname === '/' && localUser) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};