import { useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';

export const useConnectToExtension = () => {
  const { hashconnect } = useContext(HashconectServiceContext);

  const connectToExtension = async () => {
    hashconnect?.connectToLocalWallet();
  };

  return connectToExtension;
};
