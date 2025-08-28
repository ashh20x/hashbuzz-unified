import { Box } from "@mui/material";
import * as styles from "./styles";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return  (<Box sx={styles.header}>
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </Box>);
};


export default SectionHeader;