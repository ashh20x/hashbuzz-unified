import { useCallback, useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';
import { useApiInstance } from '../APIConfig/api';
import { useCookies } from 'react-cookie';
import { useStore } from '../Store/StoreProvider';

export const useDisconnect = () => {
  const { topic, pairingData, hashconnect, setState } = useContext(HashconectServiceContext);
  const { Auth } = useApiInstance();
  const [_, , removeCookies] = useCookies(['aSToken']);
  const store = useStore();

  const disconnect = useCallback(async () => {
    await hashconnect?.disconnect(pairingData?.topic!);
    setState!((exState) => ({ ...exState, pairingData: null }))!;
    const logoutResponse = await Auth.doLogout();
    if (logoutResponse.success) {
      removeCookies('aSToken');
      store.dispatch({ type: 'RESET_STATE' });
    }
    return logoutResponse;
  }, [Auth, hashconnect, pairingData?.topic, store]);

  return disconnect;
};
