import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { ThemeWrapper } from './mui';
import ResponsiveToaster from './components/ui/ResponsiveToaster';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeWrapper>
      <App />
      <ResponsiveToaster />
    </ThemeWrapper>
  </StrictMode>,
);
