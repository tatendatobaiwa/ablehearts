import { useEffect, useState } from 'react';
import { safeJSONStorage } from '../utils/safeStorage';
import './ConsentDebug.css';

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

  return (
    <div className="consent-debug">
      <div><strong>Consent</strong>
        <span className={`consent-debug-pill ${consent ? 'present' : 'missing'}`}>{consent ? 'present' : 'missing'}</span>
      </div>
      <div className="consent-debug-margin-top-6">
        {consent ? (
          <>
            <div>granted: {granted}</div>
            <div className="consent-debug-pre-container">
              <pre className="consent-debug-pre">{JSON.stringify(consent, null, 2)}</pre>
            </div>
          </>
        ) : (
          <div>No stored consent</div>
        )}
      </div>
      <div className="consent-debug-margin-top-6">
        <button onClick={() => window.dispatchEvent(new Event('open-cookie-preferences'))}>Open Preferences</button>
      </div>
    </div>
  );
}