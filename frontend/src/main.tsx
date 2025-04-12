import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './main.css';
import { Provider } from 'jotai';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
