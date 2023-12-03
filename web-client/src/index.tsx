import env from '/src/common/Env';
import { render } from 'solid-js/web';
import { App } from '/src/App';

console.info('Is development mode:', env.isDevelopment());

render(() => <App />, document.body);
