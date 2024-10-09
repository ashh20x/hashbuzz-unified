import { useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';
import { ContractExecuteTransaction, ContractFunctionParameters, AccountId, ContractId } from '@hashgraph/sdk';
import BigNumber from 'bignumber.js';
import { NETWORK } from '../Utilities/helpers';
import { useStore } from '../Store/StoreProvider';

export const useTransferTokenToContract = () => {
  const { topic, hashconnect } = useContext(HashconectServiceContext);
  const store = useStore();
  const { contractAddress, collecterAddress } = store.currentUser?.config || {};

  const transferTokenToContract = async (accountId: any, data: any) => {
    try {
      const provider = hashconnect?.getProvider(NETWORK, topic!, accountId);
      if (provider) {
        const signer = hashconnect?.getSigner(provider);
        if (signer && contractAddress && collecterAddress) {
          const contract_address = ContractId.fromString(contractAddress);
          const collector_account = AccountId.fromString(collecterAddress);

          const tx = await new ContractExecuteTransaction()
            .setContractId(contract_address)
            .setGas(3000000)
            .setFunction(
              "transferTokenToContract",
              new ContractFunctionParameters()
                .addAddress(AccountId.fromString(data?.entityId).toSolidityAddress())
                .addAddress(AccountId.fromString(accountId).toSolidityAddress())
                .addInt64(new BigNumber(data?.amount?.value * Math.pow(10, data.decimals)))
            )
            .setTransactionMemo("transfer Token")
            .freezeWithSigner(signer);
          const sign = await tx.signWithSigner(signer);
          const response = await sign.executeWithSigner(signer);

          return response;
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return transferTokenToContract;
};
