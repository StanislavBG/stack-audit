import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { initTelemetry } from '@bilkobibitkov/host-kit';
import { StackAuditPage } from './StackAuditPage.js';
import './index.css';

initTelemetry({ app: 'stack-audit', version: '1.0.0' });

const CLERK_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ??
  'pk_live_Y2xlcmsuYmlsa28ucnVuJA';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_KEY}>
      <StackAuditPage />
    </ClerkProvider>
  </React.StrictMode>,
);
