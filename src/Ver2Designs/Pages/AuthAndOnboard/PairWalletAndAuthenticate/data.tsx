import Share from '@/SVGR/ShareIcon';

export const Guide = [
  {
    lable: 'Extension installed',
    description: 'Download and install HashPack Chrome extension',
    avialble: false,
    link: {
      lable: 'Chrome web store',
      icon: <Share size={20} />,
      url: 'https://chromewebstore.google.com/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk',
    },
  },
  {
    lable: 'Wallet Account',
    description: 'Login or Create account with HashPack wallet',
    avialble: false,
    link: {
      lable: 'Hashpack wallet',
      icon: <Share size={20} />,
      url: 'https://chromewebstore.google.com/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk',
    },
  },
  {
    lable: 'Restart & Connect',
    description:
      'Once installed, restart your browser to connect wallet extension first time.',
    avialble: true,
  },
];
export const GuideMobile = [
  {
    lable: 'Wallet Account',
    description: 'Login or Create account with HashPack wallet',
    avialble: false,
    link: {
      lable: 'Hashpack wallet',
      icon: <Share size={20} />,
      url: 'calling HashPack mobile App',
    },
  },
  {
    lable: 'Scan & Connect',
    description:
      'Once Wallet is ready, scan QR code with your wallet to connect your account, or use the pairing string.',
    avialble: true,
  },
];
