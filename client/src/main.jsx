import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import './styles/index.css';
import { store } from './store';
import { ThemeWrapper } from './mui';
import ResponsiveToaster from './components/ui/ResponsiveToaster';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ThemeWrapper>
          <App />
          <ResponsiveToaster />
        </ThemeWrapper>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
);
