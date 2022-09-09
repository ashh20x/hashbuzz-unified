import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, Hbar, TransactionId } from "@hashgraph/sdk";
import { toast } from "react-toastify";
import { useDappAPICall } from "../APIConfig/dAppApiServices";
import { useHashconnectService } from "./hashconnectService";
// import abi from "./Hashbuzz.json";
// const contractId = "0.0.47952016";

export const useSmartContractServices = () => {
  const { pairingData, sendTransaction } = useHashconnectService();
  const { dAppAPICall } = useDappAPICall();

  const topUpAccount = async (amount: number, accountId: string) => {
    try {
      const transactionBytes = await dAppAPICall({
        url: "transaction/create-topup-transaction",
        method: "POST",
        data: { accountId, amount: parseFloat(amount.toFixed(8)) },
      });

      const UpdateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);

      if (UpdateBalanceTransaction.success)
        await dAppAPICall({
          url: "transaction/top-up",
          method: "POST",
          data: {
            amount: parseFloat(amount.toFixed(8)),
            accountId,
          },
        });

      return UpdateBalanceTransaction;
    } catch (err) {
      console.log(err);
      //@ts-ignore
      toast.error(err.message);
    }
  };

  return { topUpAccount };
};
