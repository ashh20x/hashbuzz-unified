import React from 'react';
import { useRemoteConfig } from '../hooks/useRemoteConfig';

// Example: Feature flag for a new chat UI
const FEATURE_FLAG_KEY = 'enable_new_chat_ui';

export const FeatureFlaggedChat: React.FC = () => {
  const isEnabled = useRemoteConfig(FEATURE_FLAG_KEY);
  if (isEnabled !== true) return null;
  return <div>New Chat UI is enabled!</div>;
};
