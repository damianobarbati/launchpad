import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import AuthWatcher from '@admin/component/AuthWatcher';
import Router from '@admin/Router';
import { store } from '@admin/store';
import { SWRConfig } from 'swr';
import './axios'; // make sure to import it here, so the defaults are applied
import './sentry';

const App = () => (
  <Provider store={store}>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 1000,
      }}
    >
      <AuthWatcher />
      <Router />
    </SWRConfig>
  </Provider>
);

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);
