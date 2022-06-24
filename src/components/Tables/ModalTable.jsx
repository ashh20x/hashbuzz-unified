import { TableBody, TableRow } from "@mui/material";
import {
  BorderCellW,
  BorderCellG,
  CustomTable,
  CustomTableRowHead,
} from "./CreateTable.styles";

const ModalTable = ({ reply, retweet, like, download, follow }) => {
  return (
    <CustomTable stickyHeader aria-label="simple table">
      <TableBody>
        <CustomTableRowHead>
          <BorderCellW>Reply</BorderCellW>
          <BorderCellG>{reply + "h"}</BorderCellG>
        </CustomTableRowHead>
        <TableRow>
          <BorderCellW>Retweet</BorderCellW>
          <BorderCellG>{retweet + "h"}</BorderCellG>
        </TableRow>
        <TableRow>
          <BorderCellW>Like</BorderCellW>
          <BorderCellG>{like + "h"}</BorderCellG>
        </TableRow>
        <TableRow>
          <BorderCellW>Like Download</BorderCellW>
          <BorderCellG>{download + "h"}</BorderCellG>
        </TableRow>
        <CustomTableRowHead>
          <BorderCellW>Follow</BorderCellW>
          <BorderCellG>{follow + "h"}</BorderCellG>
        </CustomTableRowHead>
      </TableBody>
    </CustomTable>
  );
};

export default ModalTable;
