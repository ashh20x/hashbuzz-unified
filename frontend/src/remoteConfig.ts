import {
  fetchAndActivate,
  getAll,
  getRemoteConfig,
  getValue,
  RemoteConfig,
} from 'firebase/remote-config';
import { app } from './firebaseConfig';

export interface RemoteConfigValues {
  [key: string]: string | number | boolean;
}

let remoteConfig: RemoteConfig | null = null;
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export const initRemoteConfig = async (): Promise<void> => {
  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    console.warn(
      '⏳ Firebase Remote Config initialization already in progress, waiting...'
    );
    return initializationPromise;
  }

  // Return immediately if already initialized
  if (isInitialized && remoteConfig) {
    console.warn('✅ Firebase Remote Config already initialized, skipping...');
    return Promise.resolve();
  }

  // Create initialization promise
  initializationPromise = (async () => {
    try {
      console.warn('🚀 Initializing Firebase Remote Config...');
      remoteConfig = getRemoteConfig(app);

      // Set default values for feature flags
      remoteConfig.defaultConfig = {
        campaign_v201: false,
        enable_new_chat_ui: false,
        some_other_flag: false,
        dashboard_redesign: false,
      };

      // Set fetch settings
      remoteConfig.settings = {
        minimumFetchIntervalMillis:
          process.env.NODE_ENV === 'development' ? 60000 : 3600000, // 1 min dev, 1 hour prod
        fetchTimeoutMillis: 10000, // 10 seconds
      };

      await fetchAndActivate(remoteConfig);
      isInitialized = true;
      console.warn('✅ Firebase Remote Config initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Remote Config:', error);
      initializationPromise = null; // Reset promise on error so retry is possible
      throw error;
    }
  })();

  return initializationPromise;
};

export const getRemoteConfigValue = (key: string): string | undefined => {
  if (!remoteConfig || !isInitialized) {
    console.warn(
      `⚠️ Remote Config not initialized, cannot get value for: ${key}`
    );
    return undefined;
  }
  return getValue(remoteConfig, key).asString();
};

export const getAllRemoteConfigValues = (): RemoteConfigValues => {
  if (!remoteConfig || !isInitialized) {
    console.warn('⚠️ Remote Config not initialized, returning empty object');
    return {};
  }
  const all = getAll(remoteConfig);
  const result: RemoteConfigValues = {};
  Object.keys(all).forEach(key => {
    result[key] = all[key].asString();
  });
  return result;
};

// Feature flag specific utilities
export const getFeatureFlagValue = (key: string): boolean => {
  if (!remoteConfig || !isInitialized) {
    console.warn(
      `⚠️ Remote Config not initialized, returning false for flag: ${key}`
    );
    return false;
  }
  return getValue(remoteConfig, key).asBoolean();
};

export const isFeatureEnabled = (flagName: string): boolean => {
  return getFeatureFlagValue(flagName);
};

// Utility to check if Remote Config is initialized
export const isRemoteConfigInitialized = (): boolean => {
  return isInitialized && remoteConfig !== null;
};
