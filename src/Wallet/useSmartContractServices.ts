import { toast } from "react-toastify";
import { useAccountId, useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { CreateTransactionEntity } from "../types";
import { useBalances } from "../Store/useBalances";
import { useCreateTransactionBytesMutation, useSetTransactionAmountMutation } from "../API/transaction";
import { logError, logInfo, logDebug } from "../hooks/session-manager/utils";

export const useSmartContractServices = () => {
  const { data: accountId } = useAccountId();
  const { isConnected, signer } = useWallet(HWCConnector);
  
  const [createTransactionBytes] = useCreateTransactionBytesMutation();
  const [setTransactionAmount] = useSetTransactionAmountMutation();
  const { startBalanceQueryTimer } = useBalances();

  const topUpAccount = async (entity: CreateTransactionEntity) => {
    try {
      if (!isConnected || !accountId || !signer) {
        logError(new Error("Wallet not connected"), "Wallet connection required for transaction");
        toast.error("Please connect your wallet first");
        return;
      }

      logDebug("Starting topup transaction", `useSmartContractServices.topUpAccount`);

      // Create transaction bytes using RTK Query
      const transactionBytes = await createTransactionBytes({ 
        entity, 
        connectedAccountId: accountId 
      }).unwrap();

      // Sign transaction using new wallet adapter
      const signatureObjs = await (signer as any).sign([transactionBytes]);
      const signedTransaction = signatureObjs[0];
      
      logInfo("Transaction signed successfully", `useSmartContractServices.topUpAccount`);

      if (signedTransaction) {
        // Create the transaction response object similar to the old format
        const updateBalanceTransaction = {
          success: true,
          response: {
            transactionId: signedTransaction.transactionId || '',
            accountId: signedTransaction.accountId?.toString() || accountId,
            signature: signedTransaction.signature,
          }
        };

        const transactionResponse = updateBalanceTransaction.response;

        // Set transaction amount using RTK Query
        const getBal = await setTransactionAmount({
          entity,
          response: JSON.stringify(updateBalanceTransaction),
          transactionId: transactionResponse.transactionId,
        }).unwrap();

        if (getBal.message) {
          getBal.error 
            ? toast.error(getBal.message ?? "Error with request for balance update.") 
            : toast.info(getBal.message);
        }

        startBalanceQueryTimer();
        logInfo("Transaction completed successfully", `useSmartContractServices.topUpAccount`);
        return updateBalanceTransaction;
      }
    } catch (err: any) {
      logError(err, "Topup transaction failed", `useSmartContractServices.topUpAccount`);
      
      // Handle RTK Query errors
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    }
  };

  return { 
    topUpAccount,
    isWalletConnected: isConnected,
    accountId 
  };
};

export default useSmartContractServices;