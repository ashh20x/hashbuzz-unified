import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(["token"]);
  if (!cookies.token) return <Navigate to={"/"} />;
  return children;
};
