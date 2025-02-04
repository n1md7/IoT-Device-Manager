import env from './common/Env';
import { render } from 'solid-js/web';
import { App } from './App';

console.info('Is development mode:', env.isDevelopment());

render(() => <App />, document.body);
