import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, TransactionId } from "@hashgraph/sdk";
import { useHashconnectService } from "./hashconnectService";
// import abi from "./Hashbuzz.json";
const contractId = "0.0.47952016";

export const useSmartContractServices = () => {
  const { pairingData, sendTransaction } = useHashconnectService();

  const addCampaigner = async (accountId: string) => {
    const contractExTx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(1000000)
      .setFunction("addCampaigner", new ContractFunctionParameters().addAddress(AccountId.fromString(accountId).toSolidityAddress()));

    const transactionBytes: Uint8Array = contractExTx.toBytes();
    return await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
  };

  const topUpAccount = async (amount: number, accountId: string) => {
    const address = AccountId.fromString(accountId).toSolidityAddress();
    const deposit = true;

    const nodeId = [new AccountId(3)];
    const transId = TransactionId.generate(accountId);

    //initiate new contract params
    const contractParams = new ContractFunctionParameters();

    contractParams.addAddress(address);
    contractParams.addUint256(amount * Math.pow(10, 8));
    contractParams.addBool(deposit);

    let contractExBalTx = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(1000000)
      .setFunction("updateBalance", contractParams)
      .setTransactionMemo("Hashconnect update balance call")
      .setGas(100000);

    contractExBalTx.setNodeAccountIds(nodeId);
    contractExBalTx.setTransactionId(transId);
    contractExBalTx = contractExBalTx.freeze();
    const transactionBytes: Uint8Array = contractExBalTx.toBytes();
    return await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
  };

  return { addCampaigner, topUpAccount };
};
