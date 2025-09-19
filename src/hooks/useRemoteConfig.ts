import {
  getAll,
  getRemoteConfig,
  getValue,
  RemoteConfig,
} from 'firebase/remote-config';
import { useEffect, useState } from 'react';
import localFlags from '../featureFlags.local.json';
import { app } from '../firebaseConfig';
import { isRemoteConfigInitialized } from '../remoteConfig';

type RemoteConfigSupportedType = string | boolean | number;

function parseValue(val: unknown): RemoteConfigSupportedType {
  if (val === 'true' || val === true) return true;
  if (val === 'false' || val === false) return false;
  if (!isNaN(Number(val)) && val !== '' && val !== null) return Number(val);
  return String(val);
}

export function useRemoteConfig(
  key?: string
):
  | RemoteConfigSupportedType
  | Record<string, RemoteConfigSupportedType>
  | undefined {
  const [value, setValue] = useState<
    | RemoteConfigSupportedType
    | Record<string, RemoteConfigSupportedType>
    | undefined
  >(undefined);

  useEffect(() => {
    // Check for local override in development mode
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev && localFlags) {
      if (key) {
        if (Object.prototype.hasOwnProperty.call(localFlags, key)) {
          setValue(
            (localFlags as Record<string, RemoteConfigSupportedType>)[key]
          );
          return;
        }
      } else {
        setValue(localFlags as Record<string, RemoteConfigSupportedType>);
        return;
      }
    }

    // Wait for Remote Config to be initialized before accessing it
    const checkRemoteConfig = () => {
      if (!isRemoteConfigInitialized()) {
        // If not initialized, wait and retry
        setTimeout(checkRemoteConfig, 100);
        return;
      }

      // Fallback to Firebase Remote Config
      const remoteConfig: RemoteConfig = getRemoteConfig(app);
      if (key) {
        const val = getValue(remoteConfig, key).asString();
        setValue(parseValue(val));
      } else {
        const all = getAll(remoteConfig);
        const result: Record<string, RemoteConfigSupportedType> = {};
        Object.keys(all).forEach(k => {
          result[k] = parseValue(all[k].asString());
        });
        setValue(result);
      }
    };

    checkRemoteConfig();
  }, [key]);

  return value;
}
