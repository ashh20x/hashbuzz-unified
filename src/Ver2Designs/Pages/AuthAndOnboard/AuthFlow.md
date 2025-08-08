# Authentication Flow

Below is an enhanced authentication flow for new and returning users. Step names are meaningful and readable.

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
