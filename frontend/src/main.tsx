import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { persistor, store } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import theme from '../theme.ts';
import { addInterceptors } from './axiosApi.ts';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants.ts';
import App from './App';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </GoogleOAuthProvider>
  </Provider>,
);
