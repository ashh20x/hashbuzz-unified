const {
  ContractCreateFlow,
  AccountId,
  Client,
  PrivateKey,
  ContractFunctionParameters,
} = require("@hashgraph/sdk");
require("dotenv").config();
const allContracts = require("./allContracts");

const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
// Testnet Client
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  const bytecode = allContracts.HashbuzzV201.bytecode;

  /////////////////////DEPLOY THE SMART CONTRACT ////////////////////////////////
  const createContract = new ContractCreateFlow()
    .setGas(5000000)
    .setBytecode(bytecode)
    .setConstructorParameters(
      "constructor",
      new ContractFunctionParameters().addAddress(
        operatorId.toSolidityAddress()
      )
    )
    .setAdminKey(operatorKey);
  const createSubmit = await createContract.execute(client);
  const createRx = await createSubmit.getReceipt(client);
  const contractId = createRx.contractId;
  console.log(" - The new contract ID is " + contractId);

  process.exit(0);
}

const arags = new ContractFunctionParameters().addAddress(
  operatorId.toSolidityAddress()
);

main();
