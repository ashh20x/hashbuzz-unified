# Hashbuzz Contract

## Hashbuzz Smart Contract Monolithic Architecture

### Overview

The **Hashbuzz Monolithic Architecture** is a design where all the smart contract logic, state, and utility functions are bundled into a single contract. This is in contrast to a modular or upgradeable system. The monolithic approach integrates all the functionalities in a single codebase, making it simpler but less flexible in terms of upgrades and separation of concerns.

In the provided contract, _`HashbuzzV201`_, the following key modules and functionalities are combined into one contract:

- **State Management (HashbuzzStates):** Holds the state variables like the owner and other application-related data (e.g., campaigns, balances).

- **Utility Functions (Utils):** Contains helper functions that assist with reusable logic or calculations.

- **Campaign Lifecycle (CampaignLifecycle):** Manages the lifecycle of campaigns, including creation, updates, and other events tied to campaigns.

- **Transaction Handling (Transactions):** Handles payments, fund transfers, and transactions that users can perform in the context of the application.

---

### Code Refactoring Structure

The smart contract's logic is split into separate files for better code organization and maintainability:

- **HashbuzzV201.sol:** The main contract that imports all the modules and serves as the entry point for users.
  HashbuzzStates.sol: Handles state variables and ownership logic.

- **Utils.sol:** Contains helper functions that assist the main logic.

- **CampaignLifecycle.sol:** Manages how campaigns are created, modified, and tracked within the contract.

- **Transactions.sol:** Deals with payments and transactional logic, like receiving and sending Ether.

---

### Benefits of the Monolithic Architecture

1. Simplicity: Everything is packaged in one contract, making deployment and interaction straightforward.

2. Single Deployment: Easier to deploy, as all functionalities are in one contract.

3. Efficiency: Gas costs are potentially lower for interactions as everything happens in the same contract, with no need for inter-contract communication.

### Limitations

1. **Lack of Upgradeability:** Once deployed, the contract cannot be upgraded, and any logic or security issues will require redeployment of a new contract, potentially losing state data.

2. **Maintenance:** Over time, adding new features or fixing bugs can become difficult since everything is tightly coupled.

3. **Complexity Growth:** As the contract grows, it becomes harder to manage and test all aspects, increasing the likelihood of errors and security vulnerabilities.

---

## Hashbuzz Smart Contract (Proxy) Upgradeable Architecture

### Overview

Hashbuzz201 is an upgradeable smart contract system using the Proxy Pattern by separating state storage and business logic. This allows for secure and efficient upgrades without disrupting existing state data.

**The system is divided into three core contracts:**

1. **State Contract (HashbuzzState201):** This holds the persistent state of the system, such as campaign data and ownership information.

2. **Logic Contract (HashbuzzLogicV201):** This contains the core logic of the application, such as campaign creation and management , rearding and other key utils.

3. **Proxy Contract (HashbuzzProxy):** This delegates all calls to the logic contract while maintaining the same storage context in the state contract.

By separating logic from state, we can upgrade the logic contract without modifying the state, ensuring that we can improve and patch the system as needed.

---

### Architecture

#### 1. State Contract (HashbuzzState201.sol)

The State Contract holds all the data (storage) for the application. This contract will never be upgraded to avoid losing data. It stores variables such as campaignCount, campaigns, and owner.

**Key responsibilities:**

- Maintain campaign and other state-related data.

- Provide owner-based access control for upgradeability.

- Link to the current Logic Contract address to ensure interaction consistency.

#### 2. Logic Contract (HashbuzzLogicV201.sol)

The Logic Contract contains the business logic for the system, such as creating campaigns, managing funds, and handling transactions. It interacts with the HashbuzzState contract to read and update the state.

**Key responsibilities:**

- Implement the business logic, like campaign management.
- Read from and write to the HashbuzzState contract.
- Be upgradeable via the proxy contract.

#### 3. Proxy Contract (HashbuzzProxy.sol)

The Proxy Contract serves as the entry point for all interactions with the system. It delegates function calls to the Logic Contract and ensures that the State Contract is kept intact.

**Key responsibilities:**

- Delegate function calls to the current Logic Contract.

- Store the address of the current Logic Contract to ensure upgradeability.

- Ensure that state storage occurs in the HashbuzzState contract.

---

### Features

- **Upgradeable:** The logic of the system can be upgraded without affecting the state.

- **Secure:** Only the owner can upgrade the logic contract to prevent unauthorized changes.

- **Modular:** The system is easy to extend and manage due to the separation of state and logic.

---

### Security Considerations

- **Access Control:** Only the owner of the system can upgrade the logic contract. Make sure the onlyOwner modifier is correctly applied to sensitive functions.

- **Delegatecall:** The proxy uses delegatecall to execute the logic contract’s code within the storage context of the proxy contract. Ensure that the storage layout of the state contract remains compatible with new logic contract versions.

- **Testing:** Always thoroughly test new logic contracts in a staging environment before upgrading the production contract.

### License

This project is licensed under the Apache-2.0 License. See the LICENSE file for details.

### Author

Hashbuzz Team, 2024
