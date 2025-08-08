# Authentication Flow

Below is an enhanced authentication flow for new and returning users. Step names are meaningful and readable.

```mermaid
flowchart TD
    Start([Start]) --> CheckWalletPaired{Is Wallet Paired?}

    %% Returning User Flow
    CheckWalletPaired -- Yes --> SendPing{Ping API with WalletId}
    CheckWalletPaired -->|No| WalletPairing

    SendPing -->|User Found| CheckXAccountLinked{Is X Account Linked?}
    SendPing -->|User Not Found| NewUserOnboarding

    CheckXAccountLinked -->|Yes| GoToDashboard([Go to Dashboard])
    CheckXAccountLinked -->|No| XAccountConnection

    %% New User Flow
    NewUserOnboarding[Redirect to Onboarding] --> WalletPairing

    WalletPairing[Step: Pair Wallet]
    WalletPairing -->|Paired| AuthenticateUser
    AuthenticateUser[Step: Authenticate User]
    AuthenticateUser -->|Challenge API with walletId| CheckUserExistence{Is Existing User?}

    CheckUserExistence -->|New User| XAccountConnection
    CheckUserExistence -->|Returning User| CheckXAccountLinked

    XAccountConnection[Step: Connect X Account]
    XAccountConnection -->|Connected| TokenAssociationPrompt{Associate Token?}
    
    TokenAssociationPrompt -->|Yes| TokenAssociation[Step: Associate Token]
    TokenAssociationPrompt -->|No| GoToDashboard
    TokenAssociation -->|Done| GoToDashboard

    %% Redirect from failed returning user validation
    Restart([Restart]) --> WalletPairing
```


## StepGuard Component Flow

The `StepGuard` component ensures users can only access routes appropriate to their authentication state, as tracked in the auth store.

```mermaid
flowchart TD
    RouteAccess([User Navigates to Route]) --> CheckWalletPairing{Check wallet pairing ?}

    CheckWalletPairing -- Paired --> CheckUserExistence{Ping all call with wallet?}
    CheckWalletPairing -- No --> RedirectWalletPairing([Redirect to Wallet Pairing])

    PingWithWalletId -- |Returning User| --> CheckXLinked

    CheckWalletPaired -- No --> RedirectWalletPairing([Redirect to Wallet Pairing])
    CheckWalletPaired -- Yes --> CheckUserExistence{Is Existing User?}

    CheckUserExistence -- No --> RedirectOnboarding([Redirect to Onboarding])
    CheckUserExistence -- Yes --> CheckXLinked

    CheckXLinked -- No --> RedirectXConnect([Redirect to X Account Connection])
    CheckXLinked -- Yes --> AllowAccess([Allow Route Access])

    %% Token Association Guard
    AllowAccess --> CheckTokenAssociation{Is Token Association Required?}
    CheckTokenAssociation -- Yes --> CheckTokenAssociated{Is Token Associated?}
    CheckTokenAssociation -- No --> GrantAccess([Grant Access])

    CheckTokenAssociated -- No --> RedirectTokenAssociation([Redirect to Token Association])
    CheckTokenAssociated -- Yes --> GrantAccess
```