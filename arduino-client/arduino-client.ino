#include <SPI.h>
#include <Ethernet.h>
#include <ArduinoJson.h>
#include <AbleButtons.h>
#include <PubSubClient.h>

#include "Component.h"

#define DEVICE_CODE "D0001"
#define DEVICE_NAME "Water Pump"
#define INITIAL_PING_INTERVAL 5000

#define RELAY_PIN 2    // Relay pin to control the water pump
#define CON_LED_PIN 3  // LED pin to indicate the connection status
#define BUTTON_PIN 4   // Button pin to control the water pump ON/OFF

#define MQTT_CLIENT_ID DEVICE_NAME " (" DEVICE_CODE ")"
#define MQTT_HOST "192.168.116.154"
#define MQTT_PORT 1883

#define SUBSCRIBE_TOPIC "home/devices/" DEVICE_CODE "/set"
#define PUBLISH_TOPIC "home/devices/" DEVICE_CODE "/state"

#define ON "ON"
#define OFF "OFF"

using Button = AblePullupClickerButton;

byte mac[] = { 0xE4, 0x5F, 0x01, 0xC5, 0xBB, 0xA9 };  // Arduino
IPAddress ip(192, 168, 116, 124);                     // Arduino

const Component connectingLight(CON_LED_PIN, HIGH, LOW);
const Component externalRelay(RELAY_PIN, LOW, HIGH);
const Button startButton(BUTTON_PIN);

EthernetClient ethClient;
PubSubClient client;

unsigned long PING_INTERVAL = INITIAL_PING_INTERVAL;

void onMessage(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [ ");
  Serial.print(topic);
  Serial.println(" ] ");

  DynamicJsonDocument decoded(64);
  deserializeJson(decoded, payload);

  // NestJS MQTT message emitter adds "data" property
  const char *status = decoded["data"]["status"];
  const int minutes = decoded["data"]["time"]["min"];
  const int seconds = decoded["data"]["time"]["sec"];

  Serial.print("Status: ");
  Serial.print(status);
  Serial.print("; Time: ");
  Serial.print(minutes);
  Serial.print(":");
  Serial.print(seconds);
  Serial.println();

  const bool requestedToTurnOn = strcmp(status, ON) == 0;

  externalRelay.setState(requestedToTurnOn);
}

void reconnect() {
  static unsigned long lastReconnectAttempt = 0;
  unsigned long currentMillis = millis();

  if (currentMillis - lastReconnectAttempt < PING_INTERVAL) return;

  Serial.println("Attempting MQTT connection...");
  if (client.connect(MQTT_CLIENT_ID)) {
    Serial.println("Connected to MQTT broker!");
    Serial.print("Subscribing to topic: ");
    Serial.println(SUBSCRIBE_TOPIC);

    client.subscribe(SUBSCRIBE_TOPIC);
    lastReconnectAttempt = 0;               // Reset the reconnect attempt counter
    PING_INTERVAL = INITIAL_PING_INTERVAL;  // Reset the retry delay
    connectingLight.off();                  // Turn off when connected
  } else {
    Serial.print("Failed to connect, rc=");
    Serial.print(client.state());
    Serial.println(" Retrying in " + String(PING_INTERVAL / 1000) + " seconds");

    // Use exponential backoff for retry delay
    lastReconnectAttempt = currentMillis;
    PING_INTERVAL = min(2 * PING_INTERVAL, 30000);  // Maximum retry delay of 30 seconds

    connectingLight.on();  // Turn on when trying to reconnect
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

  startButton.begin();

  // Turn on when starting up
  // Indicates that device is trying to connect to MQTT broker
  // Once connected, it will turn off
  connectingLight.on();
}

unsigned long lastPublishedAt = 0;

void publishCurrentState() {
  DynamicJsonDocument payload(128);

  payload["status"] = externalRelay.isOn() ? ON : OFF;
  payload["name"] = DEVICE_NAME;
  payload["code"] = DEVICE_CODE;
  payload["time"]["min"] = millis() / 60000;
  payload["time"]["sec"] = (millis() / 1000) % 60;

  char buffer[128];
  serializeJson(payload, buffer);

  client.publish(PUBLISH_TOPIC, buffer);

  lastPublishedAt = millis();
}

void evaluateIntervalForMQTT() {
  if (millis() - lastPublishedAt < PING_INTERVAL) return;

  publishCurrentState();
}

void loop() {
  if (!client.connected()) reconnect();

  client.loop();
  startButton.handle();

  if (startButton.resetClicked()) {
    externalRelay.toggle();
    publishCurrentState();
  }

  evaluateIntervalForMQTT();
}
