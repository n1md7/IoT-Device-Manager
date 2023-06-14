/*
 Basic MQTT example

 This sketch demonstrates the basic capabilities of the library.
 It connects to an MQTT server then:
  - publishes "hello world" to the topic "sending:out:to:node"
  - subscribes to the topic "sending:out:to:arduino", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.

*/

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

byte mac[] = {0xE4, 0x5F, 0x01, 0xC5, 0xBB, 0xA9};
IPAddress ip(192, 168, 116, 3);
IPAddress server(91, 121, 93, 94); // test.mosquitto.org

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char) payload[i]);
  }
  Serial.println();
}

EthernetClient ethClient;
PubSubClient client(ethClient);

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("arduinoClient")) {
      Serial.println("Connected to MQTT broker");
      // Once connected, publish an announcement...
      client.publish("sending:out:to:node", "Hello Node! From Arduino");
      // ... and resubscribe
      client.subscribe("sending:out:to:arduino");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(57600);

  client.setServer(server, 1883);
  client.setCallback(callback);

  Ethernet.begin(mac, ip);
  // Allow the hardware to sort itself out
  delay(1500);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
