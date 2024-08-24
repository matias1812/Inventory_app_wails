import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './utils/store';
import App from './App';
import { AuthProvider } from './utils/sessionContext';
import './style.css'
ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <AuthProvider>
        <App />
    </AuthProvider>
  </Provider>
);
