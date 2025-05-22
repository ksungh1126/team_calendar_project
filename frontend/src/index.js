
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 이 파일이 없으면 삭제해도 됩니다

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
