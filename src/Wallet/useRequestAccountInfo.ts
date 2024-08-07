import { useCallback, useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';
import { MessageTypes } from 'hashconnect';

export const useRequestAccountInfo = () => {
  const { topic, network, hashconnect } = useContext(HashconectServiceContext);

  const requestAccountInfo = useCallback(async () => {
    const request: MessageTypes.AdditionalAccountRequest = {
      topic: topic!,
      network: network!,
      multiAccount: true,
    };

    await hashconnect?.requestAdditionalAccounts(topic!, request);
  }, [hashconnect, network, topic]);

  return requestAccountInfo;
};
