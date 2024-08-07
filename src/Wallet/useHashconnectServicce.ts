import { useContext } from 'react';
import { HashconectServiceContext } from './hashconnectService';

export const useHashconnectService = () => {
  console.log("useHashconnectService is called")
  const context = useContext(HashconectServiceContext);
  return {
    ...context,
   
  };
};
