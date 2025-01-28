import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import Main from './Main';
import { register } from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/Neubey"> {/* Only one BrowserRouter */}
      <Main />
    </BrowserRouter>
  </React.StrictMode>
);

register(); // Register the service worker
reportWebVitals();
