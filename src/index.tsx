import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { register, ServiceWorkerConfig } from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const configuration: ServiceWorkerConfig = {
  onUpdate: (registration: ServiceWorkerRegistration) => {
    if (!registration.waiting) return;
    if (!window.confirm('アプリが更新されました。新しいバージョンへ移行するため、ページをリロードしてもよろしいですか?')) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  },
};

register(configuration);

reportWebVitals();
