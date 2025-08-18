import { useEffect, useState } from 'react';
import { safeJSONStorage } from '../utils/safeStorage';

// Small debug indicator for consent state (dev-only by default)
export default function ConsentDebug() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const sync = () => setConsent(safeJSONStorage.getItem('cookie_consent', null));
    sync();

    const handler = () => sync();
    window.addEventListener('cookie-consent-updated', handler);

    // Also sync on visibility change and storage events
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('cookie-consent-updated', handler);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (!import.meta.env.DEV) return null; // Only show in dev

  const granted = consent ? ['functional', 'analytics', 'marketing'].filter(k => consent[k]).join(', ') || 'necessary only' : 'none';

  const style = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    padding: '8px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    zIndex: 9999,
    maxWidth: '280px'
  };

  const pill = {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '999px',
    background: consent ? '#28a745' : '#dc3545',
    color: '#fff',
    marginLeft: '6px'
  };

  return (
    <div style={style}>
      <div><strong>Consent</strong>
        <span style={pill}>{consent ? 'present' : 'missing'}</span>
      </div>
      <div style={{ marginTop: 6 }}>
        {consent ? (
          <>
            <div>granted: {granted}</div>
            <div style={{ maxHeight: 100, overflow: 'auto', marginTop: 4 }}>
              <pre style={{ margin: 0 }}>{JSON.stringify(consent, null, 2)}</pre>
            </div>
          </>
        ) : (
          <div>No stored consent</div>
        )}
      </div>
      <div style={{ marginTop: 6 }}>
        <button onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}>Open Preferences</button>
      </div>
    </div>
  );
}