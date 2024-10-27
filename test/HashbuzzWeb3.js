const Web3 = require("web3");
const chai = require("chai");
const assert = chai.assert;
const fs = require("fs");
const path = require("path");

// Initialize Web3
const web3 = new Web3("http://localhost:7545"); // Replace with your Ethereum node URL

// Load contract ABI and address
const contractJsonPath = path.resolve(
  __dirname,
  "../build/contract/HashbuzzV201.json"
);
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath, "utf-8"));
const contractABI = contractJson.abi;
const contractAddress = "0xb4a1F63a58bfC723518976ecF71765b226Fc6dc1"; // Replace with your contract address

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

describe("HashbuzzV201 Contract", function () {
  let accounts;
  let defaultAccount;
  let campaigner;
  let inntractor;

  before(async function () {
    // Get accounts
    accounts = await web3.eth.getAccounts();
    defaultAccount = accounts[0];
    campaigner = accounts[1];
  });

  it("Should deploy the contract", async function () {
    assert.ok(contract.options.address);
  });

  it("Should whitelist fungible toke to the contrract", async function () {});

  it("Should hanle top up with fieat care fully ", async function () {});

  it("should handle the withdraw with care fully", async function () {});

  it("Should handle add cmpaigner to the contract carefully");
});
