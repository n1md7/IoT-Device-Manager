import mqtt from "mqtt";

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
  client.subscribe("sending:out:to:node", (err) => {
    if (!err) {
      client.publish("sending:out:to:arduino", "Hello Arduino! from Node");
    }
  });
});

client.on("message", (topic, message) => {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
