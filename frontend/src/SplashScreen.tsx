import React from 'react';
import './styles/SplashScreen.css';
import HashbuzzLogoMainTransparent from './SVGR/HashbuzzLogo';

interface SplashScreenProps {
  message?: string;
  showDebug?: boolean;
  debugInfo?: {
    hasInitialized?: boolean;
    isRefreshing?: boolean;
    isAppReady?: boolean;
  };
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  message = 'Loading...',
  showDebug = false,
  debugInfo,
}) => {
  return (
    <div className='splash-screen'>
      <div className='splash-content'>
        <div className='splash-logo'>
          <HashbuzzLogoMainTransparent
            height={100}
            colors={{ color1: '#fff' }}
          />
        </div>
        <div className='splash-spinner'>
          <div className='spinner' />
        </div>
        <div className='splash-message'>{message}</div>
        {showDebug && debugInfo && (
          <div className='splash-debug'>
            hasInitialized: {debugInfo.hasInitialized ? '✅' : '❌'} |{' '}
            isRefreshing: {debugInfo.isRefreshing ? '⏳' : '✅'} | isAppReady:{' '}
            {debugInfo.isAppReady ? '✅' : '❌'}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SplashScreen);
