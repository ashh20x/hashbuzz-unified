import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  if (value !== index) return null;
  return (
    <div
      role="tabpanel"
      id={`wallet-connect-tabpanel-${index}`}
      aria-labelledby={`wallet-connect-tab-${index}`}
      {...other}
    >
      <div>{children}</div>
    </div>
  );
};

export const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #E9E9E9",
  "& .MuiTabs-indicator": {
    backgroundColor: "#5265FF",
  },
});

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "capitalize",
  minWidth: 0,
  marginRight: theme.spacing(1),
  color: "#7B7B7B",
  fontSize: "1.125rem",
  lineHeight: 1.5,
  padding: "0.5rem",
  fontWeight: 600,
  "&:hover": {
    color: "#5265FF",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#5265FF",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#8a98ff",
  },
}));