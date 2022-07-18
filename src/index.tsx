import './utils/yup';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationProvider from './components/Authentication';
import ConfigurationProvider from './components/Configuration';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { StyleProvider } from '@ht6/react-ui';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <StyleProvider>
      <BrowserRouter>
        <ConfigurationProvider>
          <AuthenticationProvider>
            <App />
          </AuthenticationProvider>
        </ConfigurationProvider>
      </BrowserRouter>
    </StyleProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
