import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@descope/react-sdk';
import App from './App.tsx';
import './index.css';
import { initGlobalClickSound } from './utils/sound';
import { LanguageProvider } from './utils/LanguageContext';

initGlobalClickSound();

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SafeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[BongoWeb] Safe error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <LanguageProvider>
          <App />
        </LanguageProvider>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SafeErrorBoundary>
      <AuthProvider projectId="P3K6LwIDJRlYK19nBi2yewOjmo22">
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
    </SafeErrorBoundary>
  </StrictMode>,
);
