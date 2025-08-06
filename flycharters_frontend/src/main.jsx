import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';
import './App.css';
import './index.css';
import { AuthPopupProvider } from './context/AuthPopupContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // New
import { OperatorDataProvider } from './context/OperatorDataContext.jsx'; // New
import { BrowserRouter } from 'react-router-dom'; // New

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthPopupProvider>
          <OperatorDataProvider>
            <App />
          </OperatorDataProvider>
        </AuthPopupProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);