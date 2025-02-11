import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from "react-router-dom";
import Main from './Main';
import { register } from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Remove basename */}
      <Main />
    </Router>
  </React.StrictMode>
);

register(); // Register the service worker
reportWebVitals();
