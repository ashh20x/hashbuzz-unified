import { useStore } from "../../../Store/StoreProvider";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";

const Dashboard = () => {
  const store = useStore();
  const currentUser = store?.currentUser;

  const isAdmin = Boolean(process.env.REACT_APP_ADMIN_ADDRESS === currentUser?.hedera_wallet_id);

  if (isAdmin) {
    return <DashboardAdmin />;
  }
  return <DashboardUser />;
};

export default Dashboard;
