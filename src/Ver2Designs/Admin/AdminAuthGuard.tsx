import { useCookies } from "react-cookie";
import { useStore } from "../../Providers/StoreProvider";
import PageNotfound from "../Pages/PageNotfound";
import AdminAuth from "./AdminAuth";

const AdminAuthGuard = ({ children }: { children: JSX.Element }) => {
  const [cookies] = useCookies(["token", "adminToken"]);
  const store = useStore();
  if (!cookies.token || (store?.currentUser?.role && !["ADMIN", "SUPER_ADMIN"].includes(store?.currentUser?.role))) return <PageNotfound />;
  if(!cookies.adminToken) return <AdminAuth />;
  return children; 
};

export default AdminAuthGuard;
