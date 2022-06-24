import { ContainerStyled } from "../../ContainerStyled/ContainerStyled";
import { TableSection, TitleWrap, ToggleButton } from "./InvTranPage.styles";
import Typography from "../../../Typography/Typography";
import { InvoiceBody } from "../../Tables/InvoiceBody";
import { useState } from "react";
import { TransactionBody } from "../../Tables/TransactionBody";
import PrimaryButton from "../../Buttons/PrimaryButton";

export const InvTranPage = () => {
  const theme = {
    weight: "600",
    size: "31px",
    color: "#000000",
  };
  
  const [isInvoice, setIsInvoice] = useState(true);
  return (
    <ContainerStyled align="center">
        <ToggleButton>
          <PrimaryButton
            onclick={() => setIsInvoice(true)}
            radius="30px"
            inverse={!isInvoice}
            colors={!isInvoice? "black": "#fff"}
            text="Invoice"
          />
          <PrimaryButton
            onclick={() => setIsInvoice(false)}
            radius="30px"
            colors={isInvoice? "black": "#fff"}
            inverse={isInvoice}
            text="Transactions"
          />
        </ToggleButton>
      <TitleWrap>
        <Typography theme={theme}>
          {isInvoice ? "Invoice" : "Transaction"}
        </Typography>
      </TitleWrap>
      <TableSection>
        {isInvoice ? <InvoiceBody /> : <TransactionBody />}
      </TableSection>
    </ContainerStyled>
  );
};
