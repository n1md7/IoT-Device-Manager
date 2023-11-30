#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "Component.h"

#define DEVICE_CODE "D0001"
#define DEVICE_NAME "Water Pump"
#define INITIAL_PING_INTERVAL 5000

#define MQTT_CLIENT_ID DEVICE_NAME " (" DEVICE_CODE ")"
#define MQTT_HOST "192.168.116.154"
#define MQTT_PORT 1883

#define SUBSCRIBE_TOPIC "home/devices/" DEVICE_CODE "/set"
#define PUBLISH_TOPIC "home/devices/" DEVICE_CODE "/state"

#define ON "on"
#define OFF "off"

byte mac[] = {0xE4, 0x5F, 0x01, 0xC5, 0xBB, 0xA9}; // Arduino
IPAddress ip(192, 168, 116, 124); // Arduino

const Component statusLight(LED_BUILTIN);

EthernetClient ethClient;
PubSubClient client;

unsigned long PING_INTERVAL = INITIAL_PING_INTERVAL;

void onMessage(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [ ");
  Serial.print(topic);
  Serial.println(" ] ");

  DynamicJsonDocument decoded(32);
  deserializeJson(decoded, payload);

  const char* status = decoded["status"];
  const int minutes = decoded["time"]["minutes"];
  const int seconds = decoded["time"]["seconds"];

  Serial.print("Status: ");
  Serial.print(status);
  Serial.print(" ");
  Serial.print(minutes);
  Serial.print(":");
  Serial.print(seconds);
  Serial.println();

  statusLight.setState(strcmp(status, ON) == 0);
}

void reconnect() {
  static unsigned long lastReconnectAttempt = 0;
  unsigned long currentMillis = millis();

  if (currentMillis - lastReconnectAttempt < PING_INTERVAL) return;

  Serial.println("Attempting MQTT connection...");
  if (client.connect(MQTT_CLIENT_ID)) {
    Serial.println("Connected to MQTT broker!");
    client.subscribe(SUBSCRIBE_TOPIC);
    lastReconnectAttempt = 0;  // Reset the reconnect attempt counter
    PING_INTERVAL = INITIAL_PING_INTERVAL;  // Reset the retry delay
  } else {
    Serial.print("Failed to connect, rc=");
    Serial.print(client.state());
    Serial.println(" Retrying in " + String(PING_INTERVAL / 1000) + " seconds");

    // Use exponential backoff for retry delay
    lastReconnectAttempt = currentMillis;
    PING_INTERVAL = min(2 * PING_INTERVAL, 30000);  // Maximum retry delay of 30 seconds
  }
}

void setup() {
  Serial.begin(9600);

  Ethernet.begin(mac, ip);

  Serial.print("My IP is: ");
  Serial.println(Ethernet.localIP());

  client.setServer(MQTT_HOST, MQTT_PORT);
  client.setClient(ethClient);
  client.setCallback(onMessage);

  // Allow the hardware to sort itself out
  delay(1500);
}

unsigned long lastPublishedAt = 0;

void publishCurrentState() {
  if (millis() - lastPublishedAt < PING_INTERVAL) return;

  DynamicJsonDocument payload(128);

  payload["status"] = statusLight.isOn() ? ON : OFF;
  payload["time"]["minutes"] = millis() / 60000;
  payload["time"]["seconds"] = (millis() / 1000) % 60;

  char buffer[128];
  serializeJson(payload, buffer);

  client.publish(PUBLISH_TOPIC, buffer);

  Serial.print("."); // Print a dot so we know it's working

  lastPublishedAt = millis();
}

void loop() {
  if (!client.connected()) reconnect();

  client.loop();
  publishCurrentState();
}
