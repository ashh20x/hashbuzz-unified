import { useCookies } from "react-cookie";
import { useStore } from "../../Store/StoreProvider";
import PageNotfound from "../Pages/PageNotfound";
import AdminAuth from "./AdminAuth";

const AdminAuthGuard = ({ children }: { children: JSX.Element }) => {
  const [cookies] = useCookies(["aSToken", "adminToken"]);
  const store = useStore();
  if (!cookies.aSToken || (store?.currentUser?.role && !["ADMIN", "SUPER_ADMIN"].includes(store?.currentUser?.role))) return <PageNotfound />;
  if (!cookies.adminToken) return <AdminAuth />;
  return children;
};

export default AdminAuthGuard;
