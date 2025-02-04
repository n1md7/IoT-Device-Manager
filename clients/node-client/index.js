import mqtt from 'mqtt';
import { once } from 'events';
import { argv, env, exit } from 'node:process';
import { config } from 'dotenv';
import { start } from 'node:repl';

config({ path: '.env.development' });

/**
 * MQTT Client for Node.js, mocks Arduino device
 */

const commands = argv.slice(2);
const params = {
  name: null,
  code: null,
};
while (commands.length > 0) {
  const command = commands.shift();
  switch (command) {
    case '-n':
    case '--name':
      params.name = commands.shift();
      break;
    case '-c':
    case '--code':
      params.code = commands.shift();
      break;
    case '--env-file':
      commands.shift(); // Just skip
      break;
    default:
      console.error(`Unknown parameter: "${command}"`);
      exit(1);
  }
}

const publishTopic = `home/devices/${params.code}/state`;
const subscribeTopic = `home/devices/${params.code}/set`;
const requestUpdateTopic = `home/devices/${params.code}/request-update`;
const deviceManagerDisconnectedTopic = 'home/device-manager/disconnected';
const Status = Object.freeze({
  ON: 'ON',
  OFF: 'OFF',
});

const host = env.MQTT_HOST;
const port = env.MQTT_PORT;
const username = env.MQTT_USERNAME;
const password = env.MQTT_PASSWORD;
const protocol = env.MQTT_PROTOCOL;
const clientId = env.MQTT_CLIENT_ID;

console.info('Connecting to MQTT broker at ' + host);

const client = mqtt.connect({
  host,
  port,
  clientId,
  username,
  password,
  protocol,
  keepalive: 10,
  reconnectPeriod: 1000,
  connectTimeout: 10 * 1000,
  clean: false,
  will: {
    topic: publishTopic,
    payload: JSON.stringify({
      data: {
        status: Status.OFF,
        code: params.code,
        name: params.name,
        type: 'SWITCH',
        version: '1',
        time: 0,
      },
    }),
    qos: 1,
    retain: true,
  },
});

try {
  await once(client, 'connect');
} catch (error) {
  console.error('Error occurred while connecting to MQTT broker', error);
  exit(1);
}

console.info('Connected to MQTT broker');

client.subscribe(subscribeTopic, { qos: 1 });
client.subscribe(deviceManagerDisconnectedTopic, { qos: 1 });
client.subscribe(requestUpdateTopic, { qos: 1 });

let timer = null;
client.on('message', (topic, message) => {
  console.info(`Received message from Topic: ` + topic);
  console.info('Message: ' + message.toString());

  try {
    const payload = JSON.parse(message.toString());
    console.info('Parsed: ' + message.toString());
    if (topic === subscribeTopic) {
      const { status, time } = payload.data;
      reportState(status); // Report new state back to broker
      if (status === Status.OFF) return console.info('Timer cancelled');
      const millis = (time.min * 60 + +time.sec) * 1000;
      console.info('Setting up timer...');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        console.info('Timer callback triggered');
        reportState(Status.OFF);
        timer = null;
      }, millis);
    } else if (topic === requestUpdateTopic) {
      reportState(timer ? Status.ON : Status.OFF);
    } else if (topic === deviceManagerDisconnectedTopic) {
      console.info('Device manager disconnected, Not further action performed. Just logged here');
    }
  } catch (error) {
    console.error(error);
  }
});

function reportState(status) {
  const message = JSON.stringify({
    data: {
      status,
      code: params.code,
      name: params.name,
      type: 'SWITCH',
      version: '1',
      time: 1234,
    },
  });
  console.info('Publishing message to topic: ' + publishTopic);
  console.info('Message: ' + message);
  client.publish(
    publishTopic,
    message,
    {
      qos: 1,
      retain: true,
    },
    (err) => {
      if (!err) return console.info('Published message to ' + publishTopic);

      console.error('Error occurred while publishing message to ' + publishTopic);
    },
  );
}

const local = start();
local.useColors = true;
local.context.client = client;
local.context.reportState = reportState;
local.context.on = () => reportState(Status.ON);
local.context.off = () => reportState(Status.OFF);
local.context.Status = Status;
local.on('exit', () => {
  console.log('exiting repl');
  exit(0);
});
