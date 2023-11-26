import mqtt from "mqtt";

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const protocol = process.env.MQTT_PROTOCOL;
const topic = process.env.MQTT_TOPIC;
const clientId = process.env.MQTT_CLIENT_ID;

console.info("Connecting to MQTT broker at " + host);

const client = mqtt.connect({
  host,
  port,
  clientId,
  protocol,
  username,
  password,
  keepalive: 60,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  clean: true,
});

client.on("connect", () => {
  console.info("Connected to MQTT broker");
  client.subscribe("sending:out:to:node", (err) => {
    if (!err) {
      console.info("Subscribed to sending:out:to:node");
      console.info("Publishing to sending:out:to:arduino");
      client.publish("sending:out:to:arduino", "Hello Arduino! from Node");
    }
  });
});

client.on("message", (topic, message) => {
  console.info("Received message from topic: " + topic);
  console.info("Message: " + message.toString());
  client.end();
});

client.on("error", (error) => {
  console.error("Error occurred. ", error);
});
