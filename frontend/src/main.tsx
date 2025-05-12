import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, Provider } from 'jotai';
import { DevTools } from 'jotai-devtools';
import '@src/main.css';

import App from '@src/App.tsx';
import { setupAtoms } from '@src/atoms';

// Create a store for Jotai
const store = createStore();

// Initialize atoms with debug labels in development mode
if (process.env.NODE_ENV !== 'production') {
  try {
    // Initialize atoms with debug labels
    const registeredAtoms = setupAtoms(store);
    console.log(`[Jotai DevTools] Successfully registered ${registeredAtoms.length} atoms`);
  } catch (error) {
    console.error('[Jotai DevTools] Error initializing DevTools:', error);
  }
}

// Main app component with provider
const Kaeri = () => {
  return (
    <Provider store={store}>
      <App />
      {/* Only include DevTools in development */}
      {process.env.NODE_ENV !== 'production' && (
        <DevTools store={store} isInitialOpen={false} />
      )}
    </Provider>
  );
};

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Kaeri />
  </StrictMode>
);
