/// <reference types="vite/client" />
export {};

interface ImportMetaEnv {
  // Network Configuration
  readonly VITE_NETWORK: string;
  readonly VITE_HEDERA_NETWORK_TYPE: string;
  readonly VITE_HEDERA_NETWORK_NODES: string;
  readonly VITE_HEDERA_ACCOUNT_ID: string;
  readonly VITE_HEDERA_PRIVATE_KEY: string;

  // API Configuration
  readonly VITE_BASE_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_CAMPAIGN_API_URL: string;
  readonly VITE_ADMIN_API_URL: string;
  readonly VITE_DAPP_API: string;
  readonly VITE_MIRROR_NODE_LINK: string;

  // Social Media Integration
  readonly VITE_TWITTER_REDIRECT_URL: string;
  readonly VITE_TWITTER_CLIENT_ID: string;
  readonly VITE_TWITTER_CALLBACK_URL: string;
  readonly VITE_INSTAGRAM_REDIRECT_URL: string;
  readonly VITE_INSTAGRAM_CLIENT_ID: string;
  readonly VITE_INSTAGRAM_CALLBACK_URL: string;
  readonly VITE_LINKEDIN_REDIRECT_URL: string;
  readonly VITE_LINKEDIN_CLIENT_ID: string;
  readonly VITE_TIKTOK_REDIRECT_URL: string;
  readonly VITE_TIKTOK_CLIENT_KEY: string;

  // Firebase Configuration
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;

  // Wallet Configuration
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_WALLET_CONNECT_RELAY_URL: string;
  readonly VITE_HASHCONNECT_APP_NAME: string;
  readonly VITE_HASHCONNECT_APP_DESCRIPTION: string;
  readonly VITE_HASHCONNECT_APP_ICON: string;
  readonly VITE_HASHCONNECT_APP_URL: string;
  readonly VITE_PROJECT_ID: string;

  // Feature Flags
  readonly VITE_ENABLE_DEV_TOOLS: string;
  readonly VITE_ENABLE_DEBUG_LOGS: string;
  readonly VITE_ENABLE_HOT_RELOAD: string;
  readonly VITE_ENABLE_ERROR_OVERLAY: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_ERROR_REPORTING: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string;
  readonly VITE_ENABLE_NEW_DASHBOARD: string;
  readonly VITE_ENABLE_ADVANCED_FILTERING: string;
  readonly VITE_ENABLE_REAL_TIME_UPDATES: string;
  readonly VITE_ENABLE_WALLET_CONNECT: string;
  readonly VITE_ENABLE_HASHPACK: string;
  readonly VITE_ENABLE_BLADE_WALLET: string;
  readonly VITE_ENABLE_METAMASK: string;

  // UI/UX Configuration
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_ENABLE_THEME_SWITCHING: string;
  readonly VITE_PRIMARY_COLOR: string;
  readonly VITE_SECONDARY_COLOR: string;
  readonly VITE_SIDEBAR_DEFAULT_COLLAPSED: string;
  readonly VITE_ENABLE_MOBILE_OPTIMIZATIONS: string;
  readonly VITE_ENABLE_PWA: string;

  // Security Configuration
  readonly VITE_CSP_ENABLED: string;
  readonly VITE_ALLOWED_DOMAINS: string;
  readonly VITE_CORS_ORIGINS: string;
  readonly VITE_CORS_CREDENTIALS: string;
  readonly VITE_RATE_LIMIT_ENABLED: string;
  readonly VITE_MAX_REQUESTS_PER_MINUTE: string;

  // Performance Configuration
  readonly VITE_ENABLE_SERVICE_WORKER: string;
  readonly VITE_CACHE_DURATION: string;
  readonly VITE_ENABLE_MEMORY_CACHE: string;
  readonly VITE_ENABLE_CODE_SPLITTING: string;
  readonly VITE_CHUNK_SIZE_WARNING_LIMIT: string;
  readonly VITE_ENABLE_TREE_SHAKING: string;

  // Monitoring & Logging
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;
  readonly VITE_SENTRY_SAMPLE_RATE: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_GA_ANONYMIZE_IP: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_ENABLE_CONSOLE_LOGS: string;
  readonly VITE_LOG_API_REQUESTS: string;

  // Development Configuration
  readonly VITE_DEV_PORT: string;
  readonly VITE_DEV_HOST: string;
  readonly VITE_DEV_HTTPS: string;
  readonly VITE_SSL_CERT_PATH: string;
  readonly VITE_SSL_KEY_PATH: string;
  readonly VITE_USE_MOCK_DATA: string;
  readonly VITE_MOCK_DELAY: string;

  // Deployment Configuration
  readonly VITE_BUILD_SOURCE_MAP: string;
  readonly VITE_BUILD_ANALYZE: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_CDN_URL: string;
  readonly VITE_ENABLE_CDN: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_BUILD_DATE: string;
  readonly VITE_GIT_COMMIT: string;

  // Testing Configuration
  readonly VITE_TEST_API_URL: string;
  readonly VITE_TEST_TIMEOUT: string;
  readonly VITE_ENABLE_TEST_UTILITIES: string;

  // Media/Content
  readonly VITE_YOUTUBE_VIDEO_URL: string;

  // Legacy environment variables (for backward compatibility)
  readonly REACT_APP_NETWORK: string;
  readonly REACT_APP_DAPP_API: string;
  readonly REACT_APP_MIRROR_NODE_LINK: string;
  readonly REACT_APP_CAMPAIGN_DURATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global type extensions for browser APIs
declare global {
  interface Window {
    // Twitter widget API
    twttr?: {
      widgets: {
        load: () => void;
      };
    };

    // Analytics and tracking
    gtag?: (...args: any[]) => void;

    // Wallet APIs
    ethereum?: any;

    // Development tools
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
}

// JSX namespace for React 18+
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
