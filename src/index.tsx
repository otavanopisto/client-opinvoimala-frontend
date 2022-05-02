import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { StoreProvider } from './store/storeContext';
import { rootStore } from './store/RootStore';

import { AdminStoreProvider } from './store/admin/adminStoreContext';
import { adminRootStore } from './store/admin/AdminRootStore';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <AdminStoreProvider value={adminRootStore}>
        <App />
      </AdminStoreProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
