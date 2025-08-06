import { HWBridgeProvider } from '@buidlerlabs/hashgraph-react-wallets'
import { HederaMainnet, HederaTestnet } from '@buidlerlabs/hashgraph-react-wallets/chains'
import { HashpackConnector, HWCConnector, KabilaConnector } from '@buidlerlabs/hashgraph-react-wallets/connectors'
import { PropsWithChildren } from 'react'

const metadata = {
  name: 'Hashbuzz Social',
  description: 'Hashbuzz boosts brand communities with incentivized X posts, using project tokens to increase visibility, engagement, and token adoption, creating viral content and long-term loyalty.',
  icons: ["https://hashbuzz.social/favicons/mstile-144x144.png"],
  url: window.location.href,
}

const projectId = import.meta.env.VITE_PROJECT_ID;
const chain = import.meta.env.VITE_NETWORK === 'testnet' ? HederaTestnet : HederaMainnet;

type HashbuzzWalletProviderProps = PropsWithChildren;

const HashbuzzWalletProvider = ({ children }: HashbuzzWalletProviderProps) => {
  return (
    <HWBridgeProvider
      metadata={metadata}
      projectId={projectId}
      connectors={[HWCConnector, HashpackConnector, KabilaConnector,]}
      chains={[chain]}
    >
      {children}
    </HWBridgeProvider>
  )
}


export default HashbuzzWalletProvider