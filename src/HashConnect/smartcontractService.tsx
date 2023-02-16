import { useDappAPICall } from "../APIConfig/dAppApiServices";
import { useStore } from "../Providers/StoreProvider";
import { useHashconnectService } from "./hashconnectService";
// import abi from "./Hashbuzz.json";
// const contractId = "0.0.47952016";

export const useSmartContractServices = () => {
  const { pairingData, sendTransaction } = useHashconnectService();
  const { dAppAPICall } = useDappAPICall();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const store = useStore()!;

  const topUpAccount = async ({ topUpAmount, fee, total }: { topUpAmount: number; fee: number; total: number }, accountId: string) => {
    try {
      const transactionBytes = await dAppAPICall({
        url: "transaction/create-topup-transaction",
        method: "POST",
        data: { connectedAccountId:pairingData?.accountIds[0]!, amounts: { topUpAmount, fee, total } },
      });

      const UpdateBalanceTransaction = await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);

      if (UpdateBalanceTransaction.success) {
        const getBal = await dAppAPICall({
          url: "transaction/top-up",
          method: "POST",
          data: {
            amounts: { topUpAmount, fee, total },
          },
        });
        //@ts-ignore
        store.updateState((prevS: any) => ({ ...prevS, available_budget: getBal.available_budget }));
      }
      return UpdateBalanceTransaction;
    } catch (err) {
      console.log(err);
      //@ts-ignore
      // toast.error(err.message);
      throw err;
    }
  };

  return { topUpAccount };
};
