import { TableBody, TableRow } from '@mui/material';
import {
  BorderCellW,
  BorderCellG,
  CustomTable,
  CustomTableRowHead,
} from './CreateTable.styles';
import { useState, useEffect } from 'react';

const ModalTable = ({ reply, retweet, like, quote, currentToken, type }) => {
  const [icon, setIcon] = useState('ℏ');

  useEffect(() => {
    setIcon(type === 'HBAR' ? 'ℏ' : (currentToken?.[0]?.entityIcon ?? 'ℏ'));
  }, [type, currentToken]);
  return (
    <CustomTable stickyHeader aria-label='simple table'>
      <TableBody>
        <TableRow>
          <BorderCellW>Like</BorderCellW>
          <BorderCellG>{like + `${icon}`}</BorderCellG>
        </TableRow>
        <TableRow>
          <BorderCellW>Repost</BorderCellW>
          <BorderCellG>{retweet + `${icon}`}</BorderCellG>
        </TableRow>
        <TableRow>
          <BorderCellW>Quote</BorderCellW>
          <BorderCellG>{quote + `${icon}`}</BorderCellG>
        </TableRow>
        <CustomTableRowHead>
          <BorderCellW>Comment</BorderCellW>
          <BorderCellG>{reply + `${icon}`}</BorderCellG>
        </CustomTableRowHead>
      </TableBody>
    </CustomTable>
  );
};

export default ModalTable;
