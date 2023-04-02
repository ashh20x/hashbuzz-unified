import { useApiInstance } from "../APIConfig/api";
import { useStore } from "../Providers/StoreProvider";
import { CreateTransactionEntity } from "../types";
import { useHashconnectService } from "./hashconnectService";
// import abi from "./Hashbuzz.json";
// const contractId = "0.0.47952016";

export const useSmartContractServices = () => {
  const { pairingData, sendTransaction } = useHashconnectService();
  const { Transaction } = useApiInstance();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useStore()!;

  const topUpAccount = async (entity: CreateTransactionEntity) => {
    try {
      if (pairingData && pairingData.accountIds) {
        const transactionBytes  = await Transaction.createTransactionBytes({ entity, connectedAccountId: pairingData?.accountIds[0] });
        const UpdateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);

        if (UpdateBalanceTransaction.success) {
          const getBal = await Transaction.setTransactionAmount({ entity, transactionId: UpdateBalanceTransaction.id! });
          //@ts-ignore
          store.updateState((prevS: any) => ({ ...prevS, available_budget: getBal.available_budget }));
        }
        return UpdateBalanceTransaction;
      }
    } catch (err) {
      console.log(err);
      //@ts-ignore
      // toast.error(err.message);
      throw err;
    }
  };

  return { topUpAccount };
};
