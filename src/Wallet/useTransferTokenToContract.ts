import { useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';
import { ContractExecuteTransaction, ContractFunctionParameters, AccountId, ContractId } from '@hashgraph/sdk';
import BigNumber from 'bignumber.js';
import { COLLECTOR_ACCOUNT, CONTRACT_ADDRESS, NETWORK } from '../Utilities/helpers';

export const useTransferTokenToContract = () => {
  const { topic, hashconnect } = useContext(HashconectServiceContext);

  const transferTokenToContract = async (accountId: any, data: any) => {
    try {
      const provider = hashconnect?.getProvider(NETWORK, topic!, accountId);
      if (provider) {
        const signer = hashconnect?.getSigner(provider);
        if (signer && CONTRACT_ADDRESS && COLLECTOR_ACCOUNT) {
          const contract_address = ContractId.fromString(CONTRACT_ADDRESS);
          const collector_account = AccountId.fromString(COLLECTOR_ACCOUNT);

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
