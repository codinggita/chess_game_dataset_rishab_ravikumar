import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './styles/index.css';
import { ThemeWrapper } from './mui';
import ResponsiveToaster from './components/ui/ResponsiveToaster';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeWrapper>
        <App />
        <ResponsiveToaster />
      </ThemeWrapper>
    </HelmetProvider>
  </StrictMode>,
);
