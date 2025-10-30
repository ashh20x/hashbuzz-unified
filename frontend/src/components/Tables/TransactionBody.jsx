import { TableHead, TableRow, TableBody } from '@mui/material';
import {
  transactionData,
  transactionHeadRow,
} from '../../Data/InvoiceTransactions';
import {
  CustomTable,
  BorderlessCell,
  BorderlessHead,
  CustomTableRow,
} from './CreateTable.styles';
import PdfSVG from '../../SVGR/Pdf';

export const TransactionBody = () => {
  return (
    <CustomTable stickyHeader aria-label='simple table'>
      <TableHead>
        <TableRow>
          {transactionHeadRow.map(item => (
            <BorderlessHead
              key={item.id}
              align={item.align}
              style={{ minWidth: item.minWidth, width: item.width }}
            >
              {item.label}
            </BorderlessHead>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {transactionData.map(item => (
          <CustomTableRow>
            <BorderlessCell key={item.id}>{item.tranNo}</BorderlessCell>
            <BorderlessCell>{item.tranId}</BorderlessCell>
            <BorderlessCell>{item.senderHandle}</BorderlessCell>
            <BorderlessCell>{item.receiverHandle}</BorderlessCell>
            <BorderlessCell>{item.amountSent}</BorderlessCell>
            <BorderlessCell>{item.actionTaken}</BorderlessCell>
            <BorderlessCell>{item.tranHash}</BorderlessCell>
            <BorderlessCell>{item.nodeLink}</BorderlessCell>
            <BorderlessCell>
              <PdfSVG />
            </BorderlessCell>
          </CustomTableRow>
        ))}
      </TableBody>
    </CustomTable>
  );
};
