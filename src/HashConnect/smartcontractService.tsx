import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { useStore } from "../Providers/StoreProvider";
import { CreateTransactionEntity, TransactionResponse } from "../types";
import { useHashconnectService } from "./hashconnectService";


export const useSmartContractServices = () => {
  const { pairingData, sendTransaction } = useHashconnectService();
  const { Transaction } = useApiInstance();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useStore()!;

  const topUpAccount = async (entity: CreateTransactionEntity) => {
    try {
      if (pairingData && pairingData.accountIds) {
        const transactionBytes = await Transaction.createTransactionBytes({ entity, connectedAccountId: pairingData?.accountIds[0] });
        const updateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
        const transactionResponse =  updateBalanceTransaction.response as TransactionResponse;
        // console.log("UpdateBalanceTransaction:::-",updateBalanceTransaction)

        if (updateBalanceTransaction.success) {
          const getBal = await Transaction.setTransactionAmount({ entity, transactionId:transactionResponse.transactionId });

          if (getBal.message) {
            getBal.error ? toast.error(getBal.message ?? "Error with request for balance update.") : toast.info(getBal.message);
          }
          if (getBal.balance) {
            store.updateState((_state) => {
              const tokenIndex = _state.balances.findIndex((b) => b.entityId === getBal.balance?.token_id);
              _state.balances[tokenIndex].entityBalance = getBal.balance?.available_balance!.toFixed(4)!;
              return { ..._state };
            });
          }
          if (getBal.available_budget && getBal.available_budget > 0) {
            store.updateState((_state) => {
              if (_state.currentUser?.available_budget) _state.currentUser.available_budget = getBal.available_budget!;
              return { ..._state };
            });
          }
        }
        return updateBalanceTransaction;
      }
    } catch (err) {
      throw err;
    }
  };

  return { topUpAccount };
};
