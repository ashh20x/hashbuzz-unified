import { Navigate, useLocation, matchRoutes } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { useCookies } from 'react-cookie';

export const ProtectedRoute = ({ route, children }) => {
    const location = useLocation()

    console.log(location.pathname)
    const [cookies, setCookie] = useCookies(['token']);
    if (!cookies.token && location.pathname !== '/') {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    else if(cookies.token && location.pathname === '/') {
        return <Navigate to="/dashboard" />;
    }
    return children;
};