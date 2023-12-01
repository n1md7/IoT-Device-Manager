import mqtt from "mqtt";
import { once } from "events";

/**
 * MQTT Client for Node.js
 * This example connects to a MQTT broker and subscribes to a topic
 * "+" is a wildcard for a single level of hierarchy
 * "#" is a wildcard for multiple levels of hierarchy
 * "hello/+" will match "hello/world" but not "hello/world/again"
 * "hello/#" will match "hello/world" and "hello/world/again"
 */

const getTopicToPublish = (code) => `home/devices/${code}/set`;
const subscribeTopicPattern = "home/devices/+/state";
const Status = Object.freeze({
  ON: "ON",
  OFF: "OFF",
});

const devices = [
  {
    name: "Water Pump",
    code: "D0001",
  },
  {
    name: "Backyard Sprinkler",
    code: "D0002",
  },
];

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const protocol = process.env.MQTT_PROTOCOL;
const clientId = process.env.MQTT_CLIENT_ID;

console.info("Connecting to MQTT broker at " + host);

const client = mqtt.connect({
  host,
  port,
  clientId,
  protocol,
  keepalive: 60,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  clean: true,
});

try {
  await once(client, "connect");
} catch (error) {
  console.error("Error occurred while connecting to MQTT broker", error);
  process.exit(1);
}

console.info("Connected to MQTT broker");
client.subscribe(subscribeTopicPattern, (err) => {
  if (!err) return console.info("Subscribed to " + subscribeTopicPattern);

  console.error("Error occurred while subscribing to " + subscribeTopicPattern);
});

client.on("message", (topic, message) => {
  const [, deviceCode] = /home\/devices\/(.+)\/state/.exec(topic);
  console.info("*".repeat(50));
  console.info(`Received message from ${deviceCode}. Topic: ` + topic);
  console.info("Message: " + message.toString());
  console.info("*".repeat(50), "\n");
});

// Publish message to topic "home/devices/<device-code>/state"
// This is for demonstration purposes only
// In a real world scenario, you would have a web application
// that would publish messages to the MQTT broker
for (const device of devices) {
  const topic = getTopicToPublish(device.code);
  // "data" not required but NestJS adapter does it this way, so I'm following the same
  const message = JSON.stringify({
    data: {
      status: Status.ON,
      time: {
        minutes: 12,
        seconds: 30,
      },
    },
  });
  console.info("Publishing message to topic: " + topic);
  console.info("Message: " + message);
  client.publish(topic, message, (err) => {
    if (!err) return console.info("Published message to " + topic);

    console.error("Error occurred while publishing message to " + topic);
  });
}
