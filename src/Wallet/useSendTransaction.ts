import { useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';
import { MessageTypes } from 'hashconnect';

export const useSendTransaction = () => {
  const { topic, hashconnect } = useContext(HashconectServiceContext);

  const sendTransaction = async (trans: Uint8Array, acctToSign: string, return_trans: boolean = false, hideNfts: boolean = false) => {
    const transaction: MessageTypes.Transaction = {
      topic: topic!,
      byteArray: trans,
      metadata: {
        accountToSign: acctToSign,
        returnTransaction: return_trans,
        hideNft: hideNfts,
      },
    };
    console.log(transaction, "transaction");

    const transactionResponse = await hashconnect?.sendTransaction(topic!, transaction);
    return transactionResponse;
  };

  return sendTransaction;
};
