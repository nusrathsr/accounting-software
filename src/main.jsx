import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './utils/ThemeContext';
import App from './App';
import { GlobalProvider } from './context/GlobalContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <GlobalProvider>
        <App />
        </GlobalProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
