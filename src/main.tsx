import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/ToastProvider';
import { registerGlobalErrorHandlers } from './utils/errors';
import './index.css';

registerGlobalErrorHandlers();

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root.');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
);
