import { AccountId, ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";
import { useHashconnectService } from "./hashconnectService";
// import abi from "./Hashbuzz.json";
const contractId = "0.0.30909896";

export const useSmartContractServices = async () => {
  const { pairingData, sendTransaction } = useHashconnectService();

  const addCampaigner = async (accountId: string) => {
    const contractExTx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(1000000)
      .setFunction("addCampaigner", new ContractFunctionParameters().addAddress(AccountId.fromString(accountId).toSolidityAddress()));

    const transactionBytes: Uint8Array = contractExTx.toBytes();
    return await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
  };

  const tooUpAccount = async (amount: number, accountId: string) => {
    const address = AccountId.fromString(accountId).toSolidityAddress();
    const deposit = true;

    //initiate new contract params
    const contractParams = new ContractFunctionParameters();

    contractParams.addAddress(address);
    contractParams.addUint8(amount);
    contractParams.addBool(deposit);

    const contractExBalTx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(1000000)
      .setFunction("updateBalance", contractParams)
      .setGas(100000);

    const transactionBytes: Uint8Array = contractExBalTx.toBytes();
    return await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
  };

  return { addCampaigner, tooUpAccount };
};
