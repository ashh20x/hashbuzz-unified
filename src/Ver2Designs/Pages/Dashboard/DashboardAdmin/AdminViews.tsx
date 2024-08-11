import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useApiInstance } from "../../../../APIConfig/api";
import { CurrentUser } from "../../../../types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { set, sortBy, unionBy } from "lodash";

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

export const AdminViews = () => {
  const [allUsers, setAllUsers] = React.useState<CurrentUser[]>([]);
  const [count, setCount] = React.useState(0);

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
  ];

  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        User list
      </Typography>
      <Box sx={{ height: "500px" , minHeight:500}}>
        <DataGrid rows={sortBy(allUsers, "id")} columns={cols} paginationMode="server" rowCount={count} pagination />
      </Box>
    </Box>
  );
};

export default AdminViews;
