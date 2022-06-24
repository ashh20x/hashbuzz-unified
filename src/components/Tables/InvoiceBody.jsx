import { TableHead, TableRow, TableBody } from "@mui/material";
import { invoiceData, invoiceHeadRow } from "../../Data/InvoiceTransactions";
import { CustomTable, BorderlessCell, BorderlessHead, CustomTableRow, CustomTableRowHead } from "./CreateTable.styles";
import PdfSVG from "../../SVGR/Pdf";

export const InvoiceBody = () => {
return (
    <CustomTable stickyHeader aria-label="simple table">
          <TableHead>
            <CustomTableRowHead>
              {invoiceHeadRow.map((item) => (
                <BorderlessHead
                  key={item.id}
                  align={item.align}
                  style={{ minWidth: item.minWidth, width: item.width }}
                >
                  {item.label}
                </BorderlessHead>
              ))}
            </CustomTableRowHead>
          </TableHead>
          <TableBody>
            {invoiceData.map((item) => (
              <CustomTableRow>
                <BorderlessCell
                  key={item.id}
                >
                  {item.invoiceNo}
                </BorderlessCell>
                <BorderlessCell>{item.invoiceDate}</BorderlessCell>
                <BorderlessCell>{item.invoiceType}</BorderlessCell>
                <BorderlessCell>{item.invoiceAmount}</BorderlessCell>
                <BorderlessCell>{item.invoiceHash}</BorderlessCell>
                <BorderlessCell>{item.nodeLink}</BorderlessCell>
                <BorderlessCell><PdfSVG /></BorderlessCell>
                
              </CustomTableRow>
            ))}
          </TableBody>
        </CustomTable>
)
}