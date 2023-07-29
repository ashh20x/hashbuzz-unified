import { useCookies } from "react-cookie";
import { useStore } from "../../Store/StoreProvider";
import PageNotfound from "../Pages/PageNotfound";
import AdminAuth from "./AdminAuth";
// import { useStore } from "../Store/StoreProvider";

const AdminAuthGuard = ({ children }: { children: JSX.Element }) => {
  const [cookies] = useCookies(["aSToken", "adminToken"]);
  const store = useStore();

  if (cookies.aSToken && store?.ping.status && store.currentUser?.role && ["ADMIN", "SUPER_ADMIN"].includes(store.currentUser?.role)) {
    if (!cookies.adminToken) return <AdminAuth />;
    else return children;
  }

  return <PageNotfound />;
};

export default AdminAuthGuard;