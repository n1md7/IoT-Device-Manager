import { mqtt } from '../config/mqtt.ts';
import { argv, exit } from 'node:process';
import { Status } from '../enums/status.enum.ts';
import { z } from 'zod';
import { connectAsync } from 'mqtt';
import { Timer } from '../services/timer.ts';
import { Counter } from '../services/counter.ts';
import { ReportBuilder } from '../services/report.builder.ts';


const paramSchema = z.object({
  name: z.string(),
  code: z.string(),
  type: z.string().default('SWITCH'),
  version: z.string().default('1'),
});

type Params = z.infer<typeof paramSchema>;

const commands = argv.slice(2);
const params: Params = {
  name: '',
  code: '',
  type: 'SWITCH',
  version: '1',
};
const every = (value: number) => (current: number) => {
  return current % value === 0;
}

while (commands.length > 0) {
  const command = commands.shift();
  switch (command) {
    case '-n':
    case '--name':
      params.name = commands.shift()!;
      break;
    case '-c':
    case '--code':
      params.code = commands.shift()!;
      break;
    default:
      console.error(`Unknown parameter: "${command}"`);
      exit(1);
  }
}

paramSchema.parse(params);

const report = new ReportBuilder();
const timer = new Timer(1000); // 1 second, tick every second
const counter = new Counter(15 * 60); // 15 minutes

const publishTopic = `home/devices/${params.code}/state`;
const onTimerSet = `home/devices/${params.code}/set`;
const onRequestUpdate = `home/devices/${params.code}/request-update`;

const connection = await connectAsync(mqtt.host, {
  port: mqtt.port,
  clientId: mqtt.clientId,
  username: mqtt.username,
  password: mqtt.password,
  keepalive: 10,
  reconnectPeriod: 1000,
  connectTimeout: 10 * 1000,
  clean: false,
  will: {
    topic: publishTopic,
    payload: report.addCode(params.code)
      .addName(params.name)
      .addType(params.type)
      .addVersion(params.version)
      .addValue(0)
      .addStatus(Status.OFF).toCSV(),
    qos: 1,
    retain: true,
  },
});

console.info(`Connected to ${mqtt.host}:${mqtt.port}`);

connection.subscribe(onTimerSet, { qos: 1 });
connection.subscribe(onRequestUpdate, { qos: 1 });
connection.subscribe('/home/managers/+/status', { qos: 1 });


const timerSetSchema = z.object({
  data: z.object({
    time: z.object({
      min: z.number(),
      sec: z.number(),
    }).optional(),
    status: z.nativeEnum(Status),
  }),
});

type TimerSetType = z.infer<typeof timerSetSchema>;
type TimerOnType = Required<TimerSetType>
type TimerOffType = Omit<TimerSetType, 'time'>;

connection.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.info(`Received message on topic "${topic}":`, payload);

    switch (topic) {
      case onTimerSet:
        handleSetTimer(payload);
        break;
      case onRequestUpdate:
        publishCurrentState(timer);
        break;
      case 'home/managers/SYSTEMS/status':
      case 'home/managers/DEVICES/status':
        handleStop();
        break;
      default:
        console.error(`Unknown topic: "${topic}"`);
    }
  } catch (error) {
    console.error(error);
  }
});

function handleSetTimer(payload: unknown) {
  console.info('Verifying payload:', payload);
  console.info('Setting timer...');

  const { data } = timerSetSchema.parse(payload);
  const { time, status } = data;

  if (status === Status.OFF) {
    return handleStop();
  }

  handleStart(time);
}

function handleStop() {
  console.info('Stopping timer...');
  timer.stop();
  counter.reset();
  publishCurrentState(timer);
  console.info('Timer stopped');
}

function handleStart(time: TimerOnType['data']['time']) {
  console.info('Starting timer...');
  const timeInSec = time!.min * 60 + time!.sec;
  console.info(`Time set to ${timeInSec} seconds`);
  counter.setValue(timeInSec);

  // Let's publish the state every 10 seconds only
  const runEvery = every(10);

  timer.setCallback(() => {
    if (counter.isZero()) {
      return timer.stop();
    }

    if(runEvery(counter.decrement())) {
      publishCurrentState(timer);
    }
  })
    .start({ initialRun: true });

  console.info('Timer started');
}

function publishCurrentState(timer: Timer) {
  console.info('Publishing current state...');
  const payload = report.reset()
    .addCode(params.code)
    .addName(params.name)
    .addType(params.type)
    .addVersion(params.version)
    .addValue(counter.getValue())
    .addStatus(timer.getStatus());
  connection.publish(publishTopic, payload.toCSV(), { qos: 1 });
  console.info('Current state published');
}

