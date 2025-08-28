import useHederaErrorHandler from '@/hooks/use-hedera-error-handler';
import { setBalanceQueryTimer } from '@/Store/miscellaneousStoreSlice';
import { useAccountId, useWallet } from '@buidlerlabs/hashgraph-react-wallets';
import { HWCConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors';
import { Transaction } from '@hashgraph/sdk';
import { toast } from 'react-toastify';
import {
  useCreateTransactionBytesMutation,
  useSetTransactionAmountMutation,
} from '../API/transaction';
import { logDebug, logInfo } from '../comman/utils';
import { CreateTransactionEntity } from '../types';

export const useSmartContractServices = () => {
  const { data: accountId } = useAccountId();
  const { isConnected, signer } = useWallet(HWCConnector);

  const [createTransactionBytes] = useCreateTransactionBytesMutation();
  const [setTransactionAmount] = useSetTransactionAmountMutation();
  const { handleErrorWithToast } = useHederaErrorHandler();

  const topUpAccount = async (entity: CreateTransactionEntity) => {
    try {
      if (!isConnected || !accountId || !signer) {
        logDebug('Wallet not connected', 'Connection required for transaction');
        toast.error('Please connect your wallet first');
        return;
      }

      logDebug(
        'Starting topup transaction',
        `useSmartContractServices.topUpAccount`
      );

      // Create transaction bytes using RTK Query
      const transactionBytesResponse = await createTransactionBytes({
        entity,
        connectedAccountId: accountId,
      }).unwrap();

      logDebug(
        'Transaction bytes response received',
        JSON.stringify(transactionBytesResponse)
      );

      // Validate and extract transaction bytes
      let transactionBytes;
      if (transactionBytesResponse?.data) {
        transactionBytes = transactionBytesResponse.data;
      } else {
        throw new Error(
          'Invalid response: No transaction data received from server'
        );
      }

      if (!transactionBytes) {
        throw new Error('Invalid transaction bytes: Empty or null data');
      }

      logDebug(
        'Processing transaction bytes',
        `Type: ${typeof transactionBytes}, Length: ${transactionBytes.length || 'unknown'}`
      );

      // Step 1: Deserialize the transaction from bytes with proper error handling
      let transaction;
      try {
        if (typeof transactionBytes === 'string') {
          // Handle different string formats
          if ((transactionBytes as string).startsWith('0x')) {
            // Hex string
            const bytes = new Uint8Array(
              Buffer.from((transactionBytes as string).slice(2), 'hex')
            );
            transaction = Transaction.fromBytes(bytes);
          } else {
            // Assume base64
            const bytes = new Uint8Array(
              Buffer.from(transactionBytes as string, 'base64')
            );
            transaction = Transaction.fromBytes(bytes);
          }
        } else if (transactionBytes instanceof Uint8Array) {
          transaction = Transaction.fromBytes(transactionBytes);
        } else if (Array.isArray(transactionBytes)) {
          transaction = Transaction.fromBytes(new Uint8Array(transactionBytes));
        } else {
          throw new Error(
            `Unsupported transaction bytes format: ${typeof transactionBytes}`
          );
        }
      } catch (parseError: any) {
        logDebug(
          'Failed to parse transaction bytes',
          `Error: ${parseError.message}`
        );
        throw new Error(`Invalid transaction format: ${parseError.message}`);
      }

      logDebug(
        'Transaction parsed successfully',
        `Transaction ID: ${transaction.transactionId}`
      );

      // Step 2: Sign and execute the transaction
      const signedTx = await transaction.executeWithSigner(signer as any);
      logDebug(
        'Transaction executed successfully',
        `useSmartContractServices.topUpAccount`
      );

      // Get transaction ID from the signed transaction
      const transactionId = signedTx.transactionId?.toString() || '';
      logDebug('Transaction ID retrieved', `Transaction ID: ${transactionId}`);

      if (transactionId) {
        // Create the transaction response object similar to the old format
        const updateBalanceTransaction = {
          success: true,
          response: {
            transactionId: transactionId,
            accountId: accountId, // Use the original accountId since we can't access it from signedTx
            signature: null, // Signature is not available in this format
          },
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
            ? toast.error(
                getBal.message ?? 'Error with request for balance update.'
              )
            : toast.info(getBal.message);
        }

        setBalanceQueryTimer(15);
        logInfo(
          'Transaction completed successfully',
          `useSmartContractServices.topUpAccount`
        );
        return updateBalanceTransaction;
      }
    } catch (err: any) {
      logDebug(
        'Transaction failed',
        `Error: ${err.message || 'Unknown error'}`
      );
      handleErrorWithToast(err);
    }
  };

  return {
    topUpAccount,
    isWalletConnected: isConnected,
    accountId,
  };
};

export default useSmartContractServices;
