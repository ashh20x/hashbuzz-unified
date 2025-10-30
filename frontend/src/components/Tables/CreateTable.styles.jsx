import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { TableHead } from '@mui/material';

export const CustomTable = styled(Table)({
  '&&&': {
    // border: "1px solid #BEBEBE",
    boxSizing: 'border-box',
    borderRadius: '8px',
    borderCollapse: 'separate',
  },
});
export const CustomTable2 = styled(Table)({
  '&&&': {
    border: 'none',
    boxSizing: 'border-box',
    borderRadius: '8px',
    borderCollapse: 'separate',
    borderLeft: 'none',
  },
});
export const CustomTableRowHead = styled(TableRow)({
  '&:first-child': {
    borderLeft: 'none',
  },
  '& th:first-child': {
    borderRadius: '8px 0 0 0',
  },
  '& th:last-child': {
    borderRadius: '0 8px 0 0',
  },
});
export const CustomRowHead = styled(TableHead)({
  '& th:first-child': {
    borderRadius: '8px 0 0 0',
  },
  '& th:last-child': {
    borderRadius: '0 8px 0 0',
  },
});
export const CustomTableHeadCell = styled(TableCell)({
  '&:first-child': {
    borderLeft: 'none !important',
  },
  '&&&': {
    borderLeft: '1px solid #BEBEBE',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 600,
    color: '#696969',
    textAlign: 'center',
  },
});
export const CustomTableBodyCell = styled(TableCell)({
  '&:first-child': {
    borderLeft: 'none !important',
  },
  '&&&': {
    borderLeft: '1px solid #BEBEBE',
    borderBottom: 'none',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 400,
    color: '#696969',
    textAlign: 'center',
  },
});

export const CustomTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F6F7FE',
  },
});

export const BorderlessHead = styled(TableCell)({
  '&&&': {
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 600,
    color: '#696969',
    textAlign: 'center',
  },
});

export const BorderlessCell = styled(TableCell)({
  '&&&': {
    borderBottom: 'none',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 400,
    color: '#696969',
    textAlign: 'center',
  },
});
export const BorderCellG = styled(TableCell)({
  '&&&': {
    borderBottom: '1px solid #BEBEBE',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 400,
    color: '#696969',
    background: '#F6F7FE',
    textAlign: 'left',
    width: '50%',
  },
});
export const BorderCellW = styled(TableCell)({
  '&&&': {
    borderBottom: '1px solid #BEBEBE',
    whiteSpace: 'nowrap',
    fontSize: '18px',
    fontWeight: 400,
    color: '#696969',
    background: '#fff',
    textAlign: 'left',
  },
});

export const NumberInput = styled.input`
  height: 20px;
  width: 50px;
  background: #f3f3f3;
  border-radius: 4px;
  border: 1px solid;
  color: #9d9d9d;
  padding: 5px;
  &:focus {
    outline: none;
  }
`;
