const {
  Client,
  ContractCreateTransaction,
  ContractExecuteTransaction,
} = require("@hashgraph/sdk");
const { ethers } = require("ethers");

class HederaContract {
  constructor(client, abi) {
    this.client = client;
    this.contractId = null;
    this.abi = abi;
    this.contract = null; // Initialize as null
  }

  // Deploy method for deploying contracts with bytecode and constructor args
  async deploy(bytecode, ...constructorArgs) {
    const deployTransaction = new ContractCreateTransaction()
      .setGas(1000000) // Set appropriate gas value
      .setBytecode(bytecode);

    // Deploy contract to the network
    const response = await deployTransaction.execute(this.client);
    const receipt = await response.getReceipt(this.client);

    this.contractId = receipt.contractId ? receipt.contractId.toString() : null;
    if (!this.contractId) throw new Error("Failed to deploy contract");

    // Attach contract ID to ethers.js contract instance
    this.contract = new ethers.Contract(
      receipt.contractId.toSolidityAddress(),
      this.abi
    );

    return receipt.contractId;
  }

  // Generic method for calling contract functions with type safety
  async callMethod(methodName, ...args) {
    if (!this.contractId) throw new Error("Contract is not deployed");

    const tx = new ContractExecuteTransaction()
      .setContractId(this.contractId)
      .setGas(100000) // Set appropriate gas value
      .setFunction(methodName, ...args);

    const response = await tx.execute(this.client);
    const receipt = await response.getReceipt(this.client);
    const record = await response.getRecord(this.client);

    const functionResult = record.contractFunctionResult;
    if (!functionResult)
      throw new Error("No contract function result returned");

    const decodedReturnData = this.decodeReturnData(methodName, functionResult);
    const eventLogs = this.captureEventLogs(functionResult);

    return { decodedReturnData, eventLogs };
  }

  // Method to decode return data using ethers.js
  decodeReturnData(methodName, result) {
    const method = this.contract.interface.getFunction(methodName);
    const data = result.asBytes();
    return this.contract.interface.decodeFunctionResult(method, data);
  }

  // Method to capture event logs using ethers.js
  captureEventLogs(result) {
    const logs = result.logs.map((log) => {
      try {
        return this.contract.interface.parseLog(log);
      } catch (e) {
        console.error("Failed to parse log:", e);
        return null;
      }
    });
    return logs.filter((log) => log !== null);
  }
}

module.exports = HederaContract;
