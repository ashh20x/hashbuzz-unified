

import { getAll, getRemoteConfig, getValue, RemoteConfig } from 'firebase/remote-config';
import { useEffect, useState } from 'react';
import { app } from '../firebaseConfig';
// @ts-ignore
import localFlags from '../featureFlags.local.json';


type RemoteConfigSupportedType = string | boolean | number;

function parseValue(val: any): RemoteConfigSupportedType {
  if (val === 'true' || val === true) return true;
  if (val === 'false' || val === false) return false;
  if (!isNaN(Number(val)) && val !== '' && val !== null) return Number(val);
  return val;
}

  const [value, setValue] = useState<RemoteConfigSupportedType | Record<string, RemoteConfigSupportedType> | undefined>(undefined);

  useEffect(() => {
    // Check for local override in development mode
    const isDev = import.meta.env.MODE === 'development' || import.meta.env.DEV;
    if (isDev && localFlags) {
      if (key) {
        if (Object.prototype.hasOwnProperty.call(localFlags, key)) {
          setValue(localFlags[key]);
          return;
        }
      } else {
        setValue(localFlags);
        return;
      }
    }

    // Fallback to Firebase Remote Config
    const remoteConfig: RemoteConfig = getRemoteConfig(app);
    if (key) {
      const val = getValue(remoteConfig, key).asString();
      setValue(parseValue(val));
    } else {
      const all = getAll(remoteConfig);
      const result: Record<string, RemoteConfigSupportedType> = {};
      Object.keys(all).forEach((k) => {
        result[k] = parseValue(all[k].asString());
      });
      setValue(result);
    }
  }, [key]);

  return value;
}
