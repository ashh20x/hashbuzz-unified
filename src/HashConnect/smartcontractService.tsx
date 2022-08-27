import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, TransactionId } from "@hashgraph/sdk";
import { toast } from "react-toastify";
import { useDappAPICall } from "../APIConfig/dAppApiServices";
import { useHashconnectService } from "./hashconnectService";
// import abi from "./Hashbuzz.json";
// const contractId = "0.0.47952016";

export const useSmartContractServices = () => {
  const { pairingData, sendTransaction } = useHashconnectService();
  const { dAppAPICall } = useDappAPICall();

  const topUpAccount = async (amount: number, accountId: string) => {
    try {
      const getContractDetails = await dAppAPICall({ url: "transaction/activeContractId", method: "POST", data: { accountId } });
      const address = AccountId.fromString(accountId).toSolidityAddress();
      const deposit = true;

      const { contract_id } = getContractDetails as any as { contract_id: string; contractAddress: string };

      const nodeId = [new AccountId(3)];
      const transId = TransactionId.generate(accountId);

      //initiate new contract params
      const contractParams = new ContractFunctionParameters();

      contractParams.addAddress(address);
      contractParams.addUint256(amount * Math.pow(10, 8));
      contractParams.addBool(deposit);

      let contractExBalTx = new ContractExecuteTransaction()
        .setContractId(contract_id)
        .setGas(1000000)
        .setPayableAmount(amount)
        .setFunction("updateBalance", contractParams)
        .setTransactionMemo("Hashconnect update balance call")
        .setGas(100000);

      contractExBalTx.setNodeAccountIds(nodeId);
      contractExBalTx.setTransactionId(transId);
      contractExBalTx = contractExBalTx.freeze();
      const transactionBytes: Uint8Array = contractExBalTx.toBytes();
      return await sendTransaction(transactionBytes, pairingData?.accountIds[0]!, false, false);
    } catch (err) {
      console.log(err);
      //@ts-ignore
      toast.error(err.message);
    }
  };

  return { topUpAccount };
};
