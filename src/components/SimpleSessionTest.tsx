import { useAuthPingMutation } from '@/Ver2Designs/Pages/AuthAndOnboard/api/auth';
import React, { useEffect, useState } from 'react';

const SimpleSessionTest: React.FC = () => {
  const [pingResult, setPingResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionCheckPing] = useAuthPingMutation();

  const testPing = async () => {
    setIsLoading(true);
    setError(null);
    setPingResult(null);

    try {
      console.warn('[SIMPLE SESSION TEST] Calling auth ping...');
      const result = await sessionCheckPing().unwrap();
      console.warn('[SIMPLE SESSION TEST] Ping result:', result);
      setPingResult(result);
    } catch (err) {
      console.error('[SIMPLE SESSION TEST] Ping error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-test on mount
    testPing();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Simple Session Test</h3>
      <button onClick={testPing} disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Test Auth Ping'}
      </button>

      {isLoading && <p>Loading...</p>}

      {pingResult && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          <h4>✅ Success:</h4>
          <pre>{JSON.stringify(pingResult, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          <h4>❌ Error:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SimpleSessionTest;
