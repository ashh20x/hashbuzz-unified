# Authentication and user onboard Flow

Below is an enhanced authentication flow for new and returning users. Step names are meaningful and readable.

### Overview

The authentication and onboarding process is designed to handle both new and returning users, ensuring a smooth and secure experience. The flow consists of several key steps, each with clear responsibilities and transitions:

1. **Wallet Pairing**: The user connects their crypto wallet to the application.
2. **Authentication**: The application verifies the user's identity using the paired wallet.
3. **X Account Connection**: The user links their X (formerly Twitter) account for social features.
4. **Token Association**: The user associates supported tokens with their account (optional, depending on route requirements).

### Detailed Steps

#### 1. Wallet Pairing

- **Purpose**: Establish a secure connection between the user's wallet and the app.
- **How**: The app uses a wallet connect adapter to prompt the user to pair their wallet.
- **Outcome**: On success, the wallet address is stored in the app state.

#### 2. Authentication

- **Purpose**: Authenticate the user using their paired wallet.
- **How**: The app sends a challenge request to the backend (`POST /auth/challange-v2`), passing the wallet ID.
- **Backend Response**: Indicates if the user is new or returning, and whether their X account is already linked.
- **Outcome**: The app updates authentication state and determines the next step.

#### 3. X Account Connection

- **Purpose**: Link the user's X account for social features and verification.
- **How**: If not already connected, the user is prompted to authorize and connect their X account.
- **Outcome**: On success, the X account handle is stored in the app state.

#### 4. Token Association (Optional)

- **Purpose**: Allow users to associate supported tokens with their account for token-gated features.
- **How**: The app displays available tokens and the user's asset details. The user can choose to associate tokens or skip this step.
- **Outcome**: Associated tokens are recorded in the app state.

### Flow for Returning Users

- If the wallet is already paired, the app pings the backend to validate the session using stored credentials (e.g., browser cookies).
- If authenticated, the app checks if the X account is linked.
- If all required steps are complete, the user is directed to the dashboard.
- If any step is incomplete, the user is redirected to the appropriate onboarding step.

### Flow for New Users

- The user is guided through wallet pairing, authentication, X account connection, and (optionally) token association.
- Each step must be completed before proceeding to the next.
- Upon completion, the user is granted access to the dashboard.

### Notes

- The flow is managed by the `StepGuard` component, which ensures users complete all required steps before accessing protected routes.
- Redux `authStore` tracks the state of each step, enabling seamless navigation and state management.
- Actions such as `PAIR_WALLET`, `AUTHENTICATE`, `CONNECT_X_ACCOUNT`, and `ASSOCIATE_TOKEN` update the store and trigger step transitions.

This structured approach ensures both security and a user-friendly onboarding experience, with clear checkpoints and state management throughout the authentication process.

### User Onboard Steps flow

```mermaid
flowchart TD
    Start([Start]) --> CheckWalletPaired{Is Wallet Paired?}

    %% Returning User Flow
    CheckWalletPaired -- Yes --> SendPing{IS ping succed ? }
    CheckWalletPaired -->|No| WalletPairing

    %% Notes for Initial Check
    note1[Check with useWallet hook. isConnected true ] --> CheckWalletPaired

    SendPing -->| Autheticated | CheckXAccountLinked{Is X Account Linked?}
    SendPing -->| Error | AuthenticateUser

    %% Notes for Ping
    note2[Validates session with backend
    using stored credentials as browser cookies] --> SendPing

    CheckXAccountLinked -->|Yes| GoToDashboard([Go to Dashboard])
    CheckXAccountLinked -->|No| XAccountConnection

    note7[if user.personal_x_account has value ] --> CheckXAccountLinked

    %% New User Flow
    NewUserOnboarding([Auth and onboard Steps ]) --> WalletPairing

    WalletPairing[Step 1: Pair Wallet]
    WalletPairing -->|Paired| AuthenticateUser

    %% Notes for Wallet Pairing
    note3[ With Wallet connect Adapter connect with wallet and confirm pairing ] --> WalletPairing

    AuthenticateUser[Step 2: Authenticate User]
    AuthenticateUser --> ChallengeAPICall[[API: POST /auth/challange-v2]]
    ChallengeAPICall --> CheckUserExistence{Is Existing User?}

    note8[ WalletID is paassed here so this api will return with two boolean flag isExistingUser & isXAccountCOnnected ] --> ChallengeAPICall


    CheckUserExistence -->|New User| XAccountConnection
    CheckUserExistence -->|Existing User| CheckXAccountLinked

    XAccountConnection[Step 3: Connect X Account]
    XAccountConnection -->|Connected| TokenAssociationPrompt{Associate Token?}

    %% Notes for Token Association
    note6[ On this step we should have list of supported Tokens and user Account asset details both , This step could be skiped also ] --> TokenAssociationPrompt

    TokenAssociationPrompt -->|Yes| TokenAssociation[Step 4: Associate Token]
    TokenAssociationPrompt -->|No| GoToDashboard
    TokenAssociation -->|Done| GoToDashboard



    %% Redirect from failed returning user validation
    Restart([Restart]) --> WalletPairing

    %% Styling
    classDef note fill:#fff5ad,stroke:#867c3c,stroke-width:1px
    class note1,note2,note3,note4,note5,note6,note7,note8, note
```

## StepGuard Component Flow

The `StepGuard` component ensures proper route access based on authentication state and required step completion.

```mermaid
flowchart TD
    Start([Route Access Request]) --> RequiredStep{Check Required Step}

    %% Step 1: Wallet Check
    RequiredStep -->|Requires Wallet| WalletCheck{Is Wallet Paired?}
    WalletCheck -->|No| Redirect1[Redirect to Wallet Pairing]
    WalletCheck -->|Yes| AuthCheck

    %% Step 2: Authentication Check
    RequiredStep -->|Requires Auth| AuthCheck{Is Authenticated?}
    AuthCheck -->|No| Redirect2[Redirect to Authentication]
    AuthCheck -->|Yes| XCheck

    %% Step 3: X Account Check
    RequiredStep -->|Requires X| XCheck{Has X Account?}
    XCheck -->|No| Redirect3[Redirect to X Connection]
    XCheck -->|Yes| TokenCheck

    %% Step 4: Token Check
    RequiredStep -->|Requires Token| TokenCheck{Is Token Required?}
    TokenCheck -->|Yes| TokenAssocCheck{Is Token Associated?}
    TokenCheck -->|No| AllowAccess

    TokenAssocCheck -->|No| Redirect4[Redirect to Token Association]
    TokenAssocCheck -->|Yes| AllowAccess

    %% Final Access
    AllowAccess([Allow Route Access])


    class Redirect1,Redirect2,Redirect3,Redirect4 redirect
    class WalletCheck,AuthCheck,XCheck,TokenCheck,TokenAssocCheck check
    class AllowAccess access
```

Each step in the guard ensures:

1. Wallet pairing is complete when required
2. Authentication is valid when needed
3. X Account connection is verified for social features
4. Token association is checked for token-gated routes

## Redux `authStore` Mapping and Step Control Flow

Below is a diagram showing how the Redux `authStore` maps to authentication steps and the actions required for step transitions, as coordinated by the `StepGuard` component.

```mermaid
flowchart TD
    subgraph Redux authStore
        WalletState[wallet: isPaired, address]
        AuthState[auth: isAuthenticated, session]
        XAccountState[xAccount: isConnected, handle]
        TokenState[token: isAssociated, assets]
        StepState[currentStep]
    end

    subgraph StepGuard
        StepGuardCheck[Check Step Requirements]
        StepGuardAction[Dispatch Step Actions]
    end

    %% Mapping store to steps
    WalletState --> StepGuardCheck
    AuthState --> StepGuardCheck
    XAccountState --> StepGuardCheck
    TokenState --> StepGuardCheck
    StepState --> StepGuardCheck

    %% Actions for step movement
    StepGuardCheck -->|If step incomplete| StepGuardAction
    StepGuardAction -->|Dispatch| PairWalletAction[PAIR_WALLET]
    StepGuardAction -->|Dispatch| AuthenticateAction[AUTHENTICATE]
    StepGuardAction -->|Dispatch| ConnectXAccountAction[CONNECT_X_ACCOUNT]
    StepGuardAction -->|Dispatch| AssociateTokenAction[ASSOCIATE_TOKEN]
    StepGuardAction -->|Dispatch| SetStepAction[SET_CURRENT_STEP]

    %% Store updates on action
    PairWalletAction --> WalletState
    AuthenticateAction --> AuthState
    ConnectXAccountAction --> XAccountState
    AssociateTokenAction --> TokenState
    SetStepAction --> StepState

    %% StepGuard controls navigation
    StepGuardCheck -->|Allow| AllowRoute([Allow Route Access])
    StepGuardCheck -->|Redirect| RedirectStep([Redirect to Required Step])

    classDef store fill:#e3f6fc,stroke:#1b6ca8,stroke-width:1px
    classDef action fill:#fce3e3,stroke:#a81b1b,stroke-width:1px
    class WalletState,AuthState,XAccountState,TokenState,StepState store
    class PairWalletAction,AuthenticateAction,ConnectXAccountAction,AssociateTokenAction,SetStepAction action
```

**Key Points:**

- `authStore` holds state for each step: wallet, authentication, X account, token, and current step.
- `StepGuard` reads from `authStore` to determine if the user can proceed or needs to be redirected.
- Actions (`PAIR_WALLET`, `AUTHENTICATE`, etc.) update the store and control step transitions.
- `SET_CURRENT_STEP` tracks the user's progress for navigation and guard logic.
