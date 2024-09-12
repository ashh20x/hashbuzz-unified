import { useStore } from "../../../Store/StoreProvider";
import { ADMIN_ADDRESS } from "../../../Utilities/helpers";
import DashboardAdmin from "./DashboardAdmin";
import DashboardUser from "./DashboardUser";

const Dashboard = () => {
  const store = useStore();
  const currentUseAddress = store.currentUser?.hedera_wallet_id;

  const isAdmin = !!currentUseAddress && ADMIN_ADDRESS.includes(currentUseAddress);

  if (isAdmin) {
    return <DashboardAdmin />;
  }
  return <DashboardUser />;
};

export default Dashboard;
