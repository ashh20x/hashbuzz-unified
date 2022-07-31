import { TableBody, TableRow } from "@mui/material";
import {
  BorderCellW,
  BorderCellG,
  CustomTable,
  CustomTableRowHead,
} from "./CreateTable.styles";

const ModalTable = ({ reply, retweet, like, quote }) => {
  return (
    <CustomTable stickyHeader aria-label="simple table">
      <TableBody>
        
        <TableRow>
          <BorderCellW>Like</BorderCellW>
          <BorderCellG>{like + "ℏ"}</BorderCellG>
        </TableRow>
        <TableRow>
          <BorderCellW>Retweet</BorderCellW>
          <BorderCellG>{retweet + "ℏ"}</BorderCellG>
        </TableRow>
       
        <TableRow>
          <BorderCellW>Quote</BorderCellW>
          <BorderCellG>{quote + "ℏ"}</BorderCellG>
        </TableRow>
        <CustomTableRowHead>
          <BorderCellW>Comment</BorderCellW>
          <BorderCellG>{reply + "ℏ"}</BorderCellG>
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
