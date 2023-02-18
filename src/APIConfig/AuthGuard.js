import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ route, children }) => {
  const [cookies] = useCookies(["token"]);
  if (!cookies.token) <Navigate to={"/"} />;
  return children;
};
