import { useAppSelector } from '@/Store/store';
import DashboardAdmin from './DashboardAdmin';
import DashboardUser from './DashboardUser';

const Dashboard = () => {
  const { currentUser } = useAppSelector(s => s.app);
  const currentUseAddress = currentUser?.hedera_wallet_id;
  const currentRole = currentUser?.role;

  const isAdmin =
    !!currentUseAddress &&
    currentRole &&
    ['ADMIN', 'SUPER_ADMIN'].includes(currentRole);

  if (isAdmin) {
    return <DashboardAdmin />;
  }
  return <DashboardUser />;
};

export default Dashboard;
