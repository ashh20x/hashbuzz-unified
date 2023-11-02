import { TableBody, TableRow } from "@mui/material";
import {
  BorderCellW,
  BorderCellG,
  CustomTable,
  CustomTableRowHead,
} from "./CreateTable.styles";

const ModalTable = ({ reply, retweet, like, quote,currentToken }) => {
  return (
    <CustomTable stickyHeader aria-label="simple table">
      <TableBody>
        
        <TableRow>
          <BorderCellW>Like</BorderCellW>
          <BorderCellG>{like + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`}</BorderCellG>
        </TableRow>
        <TableRow>
          <BorderCellW>Retweet</BorderCellW>
          <BorderCellG>{retweet + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`}</BorderCellG>
        </TableRow>
       
        <TableRow>
          <BorderCellW>Quote</BorderCellW>
          <BorderCellG>{quote + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`}</BorderCellG>
        </TableRow>
        <CustomTableRowHead>
          <BorderCellW>Comment</BorderCellW>
          <BorderCellG>{reply + `${currentToken?.[0]?.entityIcon ? currentToken?.[0]?.entityIcon: "ℏ"}`}</BorderCellG>
        </CustomTableRowHead>
        {/* <CustomTableRowHead>
          <BorderCellW>Follow</BorderCellW>
          <BorderCellG>{follow + "h"}</BorderCellG>
        </CustomTableRowHead> */}
      </TableBody>
    </CustomTable>
  );
};

export default ModalTable;
