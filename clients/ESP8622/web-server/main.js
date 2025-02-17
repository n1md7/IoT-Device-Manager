import { Server } from 'http';
import { HIGH, LOW, console } from './utils';
import Switch from './switch';
import Ticker from './ticker';
import Net from 'net';
import Resource from 'Resource';

const index = new Resource('index.html');
const index2 = new Resource('index.html');
const index3 = new Resource('index.html');
const index4 = new Resource('index.html');
const bytes = new Uint8Array(index);

console.log('Length', bytes.length);

const status = new Switch({ pin: 2, signal: LOW });
const relay = new Switch({ pin: 4, signal: HIGH });
const server = new Server({ port: 80 });
const timer = new Ticker({
  startTime: 1_200_000,
  onTick: (time, logger) => {
    logger.log(`Time is remaining: ${time} seconds`);
  },
  onStart: () => {
    status.start();
    relay.start();
  },
  onStop: () => {
    status.stop();
    relay.stop();
  },
});

const routes = {
  '/': () => {
    return {
      headers: ['Content-type', 'text/html', 'Content-Length', bytes.length],
      body: index,
    };
  },
  '/on': () => {
    timer.start(10);

    return {
      headers: ['Content-type', 'application/json'],
      body: `{"active": true, "time": ${10}}`,
    };
  },
  '/off': () => {
    timer.stop();

    return {
      headers: ['Content-type', 'application/json'],
      body: `{"active": false}`,
    };
  },
  '/status': () => {
    return {
      headers: ['Content-type', 'application/json'],
      body: `{"active": ${timer.getStatus()}, "time": ${timer.getCurrentTime()}}`,
    };
  },
  404: (ctx) => {
    return {
      headers: ['Content-type', 'text/plain'],
      body: `Route not found: ${ctx.path}`,
    };
  },
};

server.callback = function (message, value) {
  switch (message) {
    case Server.status:
      const [route, query] = value.split('?');
      this.path = value;
      this.query = query;
      this.route = route;
      if (this.query) {
        this.params = this.query.split('&').reduce((params, param) => {
          const [key, value] = param.split('=');
          params[key] = value;
          return params;
        }, {});
      }
      break;
    case Server.prepareResponse:
      if (!routes[this.route]) return routes['404'](this);

      return routes[this.route](this);
  }
};

console.log(`http server ready at ${Net.get('IP')}`);
