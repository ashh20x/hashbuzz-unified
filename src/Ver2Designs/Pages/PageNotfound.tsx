import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HashbuzzLogo_Main_Transparent from "../../SVGR/HashbuzzLogo";

const PageNotfound = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" , minHeight:"100vh" }}>
      <Box sx={{textAlign:"center"}}>
        <HashbuzzLogo_Main_Transparent height={160} />
        <Typography variant="h2" sx={{marginBottom:1.5}}>404 Page not found</Typography>
        <Typography>
          Navigate to <Link to={"/"}>Home</Link>{" "}
        </Typography>
      </Box>
    </Box>
  );
};

export default PageNotfound;
