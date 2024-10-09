import { useStore } from "../../../Store/StoreProvider";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";

const Dashboard = () => {
  const store = useStore();
  const currentUseAddress = store.currentUser?.hedera_wallet_id;
  const currentRole = store.currentUser?.role;

  const isAdmin = !!currentUseAddress && currentRole && ["ADMIN", "SUPER_ADMIN"].includes(currentRole);

  if (isAdmin) {
    return <DashboardAdmin />;
  }
  return <DashboardUser />;
};

export default Dashboard;
