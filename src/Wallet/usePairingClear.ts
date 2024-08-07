import { useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';

export const usePairingClear = () => {
  const { hashconnect, setState } = useContext(HashconectServiceContext);

  const clearPairings = () => {
    hashconnect?.clearConnectionsAndData();
    setState!((exState) => ({ ...exState, pairingData: null }));
  };

  return clearPairings;
};
