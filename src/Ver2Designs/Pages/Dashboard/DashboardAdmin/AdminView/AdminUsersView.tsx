import { Delete } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { sortBy, unionBy } from "lodash";
import * as React from "react";
import { toast } from "react-toastify";
import { useApiInstance } from "../../../../../APIConfig/api";
import { CurrentUser } from "../../../../../types";

const ROLE_MAPPER = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  ANALYTICS: "Analyst",
  MARKETING: "Marketing",
  MANAGEMENT: "Management",
  USER: "Campaigner",
  GUEST_USER: "Intractor",
};

const UsersLIstCol: GridColDef[] = [
  {
    field: "id",
    headerName: "User Id",
    width: 200,
    align: "center",
  },
  {
    field: "personal_twitter_handle",
    headerName: "Personal X account",
    minWidth: 200,
  },
  {
    field: "hedera_wallet_id",
    headerName: "Wallet Id",
    minWidth: 200,
  },
  {
    field: "role",
    headerName: "User Role",
    minWidth: 200,
    //@ts-ignore
    valueGetter: (params) => ROLE_MAPPER[params.row.role],
  },
];

export const AdminUsersViews = () => {
  const [allUsers, setAllUsers] = React.useState<CurrentUser[]>([]);
  const [count, setCount] = React.useState(0);
  const [userInview, setUserInView] = React.useState<CurrentUser | null>(null);

  const api = useApiInstance();

  const getAllUsers = async () => {
    const data = await api.Admin.getAllUsers();
    setAllUsers(data.users);
    setCount(data.count);
  };

  const handleActionClick = async (id: number) => {
    console.log(id);
    const data = await api.Admin.allowUserAsCampaigner(id);
    setAllUsers((prevData) => unionBy([data.user], prevData, "id"));
  };

  const handlePageChnage = async (page: number) => {
    const data = await api.Admin.getAllUsers({
      limit: 10,
      offset: 10 * page,
    });
    setAllUsers(data.users);
    setCount(data.count);
  };

  const handleViewClick = (userData: any) => {
    const data = userData as any as CurrentUser;
    setUserInView(data);
  };

  const handleModalClose = () => {
    setUserInView(null);
  };

  const handlePersonalHandleRemove = async (id: number) => {
    try {
      const updatedUser = await api.Admin.removePerosnalHandle(id);
      setUserInView(updatedUser.data);
      toast.success(updatedUser.message);
      setAllUsers((oldData) => {
        return oldData.map((d) => (d.id === updatedUser.data.id ? updatedUser.data : d));
      });
    } catch (err) {
      toast.error("Something error handle while removing");
    }
  };

  const handlebizHandleRemove = async (id: number) => {
    try {
      const updatedUser = await api.Admin.removeBizHandle(id);
      setUserInView(updatedUser.data);
      toast.success(updatedUser.message);
      setAllUsers((oldData) => {
        return oldData.map((d) => (d.id === updatedUser.data.id ? updatedUser.data : d));
      });
    } catch (err) {
      toast.error("Something error handle while removing");
    }
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);

  const cols: GridColDef[] = [
    ...UsersLIstCol,
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      width: 200,
      renderCell: (cellValues) => {
        return (
          <Button variant="contained" color="primary" disabled={cellValues.row.role !== "GUEST_USER"} onClick={() => handleActionClick(cellValues.row.id)}>
            Allow as Cmapigner
          </Button>
        );
      },
    },
    {
      field: "action2",
      headerName: "View Details",
      minWidth: 100,
      width: 200,
      renderCell: (cellValues) => {
        return (
          <IconButton onClick={() => handleViewClick(cellValues.row)}>
            <RemoveRedEyeIcon fontSize="inherit" />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ height: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          User list
        </Typography>
        <Box sx={{ height: "500px", minHeight: 500 }}>
          <DataGrid rows={sortBy(allUsers, "id")} columns={cols} rowCount={count} loading={api.isLoading} pageSize={10} pagination paginationMode="server" onPageChange={(page, Details) => handlePageChnage(page)} />
        </Box>
      </Box>
      <Dialog maxWidth={"md"} open={Boolean(userInview)} onClose={handleModalClose} fullWidth>
        <DialogTitle>User Wallet : {userInview?.hedera_wallet_id}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableCell>User Metrics</TableCell>
              <TableCell>Values</TableCell>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Personal Handle</TableCell>
                <TableCell>
                  {userInview?.personal_twitter_handle ?? "NA"}
                  <IconButton title="Remove this handle" size="small" color="error" disabled={api.isLoading || !Boolean(userInview?.personal_twitter_handle)} sx={{ marginLeft: 2 }} onClick={() => handlePersonalHandleRemove(Number(userInview?.id))}>
                    <Delete fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Biuieness Handle</TableCell>
                <TableCell>
                  {userInview?.business_twitter_handle ?? "NA"}
                  <IconButton title="Remove this buesness handle" size="small" color="error" disabled={api.isLoading || !Boolean(userInview?.business_twitter_handle)} sx={{ marginLeft: 2 }} onClick={() => handlebizHandleRemove(Number(userInview?.id))}>
                    <Delete fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hbar Balance</TableCell>
                <TableCell>{userInview?.available_budget}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total reward gained</TableCell>
                <TableCell>{userInview?.total_rewarded}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsersViews;
