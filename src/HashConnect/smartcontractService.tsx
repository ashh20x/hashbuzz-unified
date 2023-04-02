import { toast } from "react-toastify";
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
        const transactionBytes = await Transaction.createTransactionBytes({ entity, connectedAccountId: pairingData?.accountIds[0] });
        const UpdateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);

        if (UpdateBalanceTransaction.success) {
          const getBal = await Transaction.setTransactionAmount({ entity, transactionId: UpdateBalanceTransaction.id! });

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
        return UpdateBalanceTransaction;
      }
    } catch (err) {
      throw err;
    }
  };

  return { topUpAccount };
};
