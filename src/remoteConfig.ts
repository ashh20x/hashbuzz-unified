import { fetchAndActivate, getAll, getRemoteConfig, getValue, RemoteConfig } from 'firebase/remote-config';
import { app } from './firebaseConfig';

export interface RemoteConfigValues {
  [key: string]: string | number | boolean;
}

let remoteConfig: RemoteConfig | null = null;

export const initRemoteConfig = async () => {
  remoteConfig = getRemoteConfig(app);
  // Set default settings (optional, adjust as needed)
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000, // 1 hour
  };
  await fetchAndActivate(remoteConfig);
};

export const getRemoteConfigValue = (key: string): string | undefined => {
  if (!remoteConfig) return undefined;
  return getValue(remoteConfig, key).asString();
};

export const getAllRemoteConfigValues = (): RemoteConfigValues => {
  if (!remoteConfig) return {};
  const all = getAll(remoteConfig);
  const result: RemoteConfigValues = {};
  Object.keys(all).forEach((key) => {
    result[key] = all[key].asString();
  });
  return result;
};
