import { Box, Container } from "@mui/material";
import { DashboardHeader } from "../Components";

const AdminDashboard = () => {
  return (
    <Box
      sx={{
        background: "hsl(0, 0%, 95%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <DashboardHeader />
      </Container>
    </Box>
  );
};

export default AdminDashboard;
