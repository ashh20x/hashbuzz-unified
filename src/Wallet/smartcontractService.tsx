import { toast } from "react-toastify";
import { useApiInstance } from "../APIConfig/api";
import { useStore } from "../Store/StoreProvider";
import { CreateTransactionEntity } from "../types";
import { useHashconnectService } from "./hashconnectService";
import { useBalances } from "../Store/useBalances";
const INITIAL_HBAR_BALANCE_ENTITY = {
  entityBalance: "00.00",
  entityIcon: "ℏ",
  entitySymbol: "ℏ",
  entityId: "",
  entityType: "HBAR",
};

export const useSmartContractServices = () => {
  const { pairingData, sendTransaction, transferTokenToContract, approveToken } = useHashconnectService();
  const { Transaction, User } = useApiInstance();
  const {startBalanceQueryTimer}  = useBalances()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useStore()!;

  const topUpAccount = async (entity: CreateTransactionEntity) => {
    try {
      if (pairingData?.accountIds) {
        // if (entity?.entityType === "fungible") {
        //   await approveToken(pairingData?.accountIds[0], entity);
        // }
        const transactionBytes = await Transaction.createTransactionBytes({ entity, connectedAccountId: pairingData?.accountIds[0] });
        const updateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
        const transactionResponse = updateBalanceTransaction?.response;

        console.log("Transaction of" + entity?.entityType, updateBalanceTransaction);

        if (updateBalanceTransaction?.success) {
          const getBal = await Transaction.setTransactionAmount({
            entity,
            response: typeof updateBalanceTransaction === "object" ? JSON.stringify(updateBalanceTransaction) : updateBalanceTransaction,
            //@ts-ignore
            transactionId: typeof transactionResponse === "object" ? transactionResponse.transactionId : "",
          });

          if (getBal.message) {
            getBal.error ? toast.error(getBal.message ?? "Error with request for balance update.") : toast.info(getBal.message);
          }
          startBalanceQueryTimer();
          return updateBalanceTransaction;
          //   if (getBal.balance) {
          //     store.updateState((_state) => {
          //       const tokenIndex = _state.balances.findIndex((b) => b.entityId === getBal.balance?.token_id);
          //       _state.balances[tokenIndex].entityBalance = getBal.balance?.available_balance!.toFixed(4)!;
          //       return { ..._state };
          //     });
          //   }
          //   if (getBal.available_budget && getBal.available_budget > 0) {
          //     store.updateState((_state) => {
          //       if (_state.currentUser?.available_budget) _state.currentUser.available_budget = getBal.available_budget!;
          //       return { ..._state };
          //     });
          //   }
          // }
          // const currentUser = await User.getCurrentUser();
          // store?.updateState((prev) => {
          //   return {
          //     ...prev,
          //     currentUser: currentUser,
          //     balances: [
          //       {
          //         ...INITIAL_HBAR_BALANCE_ENTITY,
          //         entityBalance: (currentUser?.available_budget ?? 0 / 1e8).toFixed(4),
          //         entityId: currentUser?.hedera_wallet_id ?? "",
          //       },
          //     ],
          //   };
          // });
          // const balancesData = await User.getTokenBalances();
          // store?.updateState((_state) => {
          //   if (balancesData.length > 0) {
          //     for (let index = 0; index < balancesData.length; index++) {
          //       const d = balancesData[index];
          //       _state.balances.push({
          //         entityBalance: d.available_balance.toFixed(4),
          //         entityIcon: d.token_symbol,
          //         entitySymbol: "",
          //         entityId: d.token_id,
          //         entityType: d.token_type,
          //       });
          //     }
          //   }
          //   return { ..._state };
          // });
          
        }
        // } else {
        //   await approveToken(pairingData?.accountIds[0], entity);
        //   const response = await transferTokenToContract(pairingData?.accountIds[0], entity);
        //   if (response) {
        //     const getBal = await Transaction.setTransactionAmount({ entity });
        //     if (getBal.message) {
        //       getBal.error ? toast.error(getBal.message ?? "Error with request for balance update.") : toast.info(getBal.message);
        //     }
        //     if (getBal.balance) {
        //       store.updateState((_state) => {
        //         const tokenIndex = _state.balances.findIndex((b) => b.entityId === getBal.balance?.token_id);
        //         _state.balances[tokenIndex].entityBalance = getBal.balance?.available_balance!.toFixed(4)!;
        //         return { ..._state };
        //       });
        //     }
        //     if (getBal.available_budget && getBal.available_budget > 0) {
        //       store.updateState((_state) => {
        //         if (_state.currentUser?.available_budget) _state.currentUser.available_budget = getBal.available_budget!;
        //         return { ..._state };
        //       });
        //     }
        //   }
        //   const currentUser = await User.getCurrentUser();
        //   store?.updateState((prev) => {
        //     return {
        //       ...prev,
        //       currentUser: currentUser,

        //       balances: [
        //         {
        //           ...INITIAL_HBAR_BALANCE_ENTITY,
        //           entityBalance: (currentUser?.available_budget ?? 0 / 1e8).toFixed(4),
        //           entityId: currentUser?.hedera_wallet_id ?? "",
        //         },
        //       ],
        //     };
        //   });
        //   const balancesData = await User.getTokenBalances();
        //   store?.updateState((_state) => {
        //     if (balancesData.length > 0) {
        //       for (let index = 0; index < balancesData.length; index++) {
        //         const d = balancesData[index];
        //         _state.balances.push({
        //           entityBalance: d.available_balance.toFixed(4),
        //           entityIcon: d.token_symbol,
        //           entitySymbol: "",
        //           entityId: d.token_id,
        //           entityType: d.token_type,
        //         });
        //       }
        //     }
        //     return { ..._state };
        //   });
        // }
      }
    } catch (err: any) {
      console.log(err, "top up error");
      toast.error(err?.response?.data?.message);
      // throw err;
    }
  };

  return { topUpAccount };
};
