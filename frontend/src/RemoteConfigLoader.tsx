import React, { useEffect, useRef, useState } from 'react';
import { initRemoteConfig } from './remoteConfig';
import SplashScreen from './SplashScreen';

interface RemoteConfigLoaderProps {
  children: React.ReactNode;
}

const RemoteConfigLoader: React.FC<RemoteConfigLoaderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const initStartedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initStartedRef.current) {
      console.warn('[RemoteConfigLoader] Already initialized, skipping');
      return;
    }

    initStartedRef.current = true;
    console.warn('[RemoteConfigLoader] Starting remote config initialization');

    initRemoteConfig()
      .then(() => {
        console.warn(
          '[RemoteConfigLoader] Remote config initialized successfully'
        );
      })
      .catch(error => {
        console.error(
          '[RemoteConfigLoader] Failed to initialize remote config:',
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependencies - only run once

  if (loading) {
    return <SplashScreen message='Initializing configuration...' />;
  }

  return <>{children}</>;
};

export default React.memo(RemoteConfigLoader);
