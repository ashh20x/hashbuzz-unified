import { TableBody, TableHead } from '@mui/material';
import { invoiceData, invoiceHeadRow } from '../../Data/InvoiceTransactions';
import PdfSVG from '../../SVGR/Pdf';
import {
  BorderlessCell,
  BorderlessHead,
  CustomTable,
  CustomTableRow,
  CustomTableRowHead,
} from './CreateTable.styles';

export const InvoiceBody = () => {
  return (
    <CustomTable stickyHeader aria-label='simple table'>
      <TableHead>
        <CustomTableRowHead>
          {invoiceHeadRow.map(item => (
            <BorderlessHead
              key={item.id}
              align={item.align}
              // style={{ minWidth: item.minWidth, width: item.width }}
              style={{ minWidth: '100%', width: '100%' }}
            >
              {item.label}
            </BorderlessHead>
          ))}
        </CustomTableRowHead>
      </TableHead>
      <TableBody>
        {invoiceData.map(item => (
          <CustomTableRow>
            <BorderlessCell key={item.id}>{item.invoiceNo}</BorderlessCell>
            <BorderlessCell>{item.invoiceDate}</BorderlessCell>
            <BorderlessCell>{item.invoiceType}</BorderlessCell>
            <BorderlessCell>{item.invoiceAmount}</BorderlessCell>
            <BorderlessCell>{item.invoiceHash}</BorderlessCell>
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
