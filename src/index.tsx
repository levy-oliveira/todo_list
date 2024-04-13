import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//"Lançar" o componente App para a div root que fica no index.html
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
