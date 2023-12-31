#include <SPI.h>
#include <Ethernet.h>
#include <ArduinoJson.h>
#include <AbleButtons.h>
#include <PubSubClient.h>

#include "Configuration.h"
#include "Component.h"
#include "Timer.h"

#define ON "ON"
#define OFF "OFF"

using Button = AblePullupClickerButton;

const Component connectingLight(CON_LED_PIN);
const Component externalRelay(RELAY_PIN);
const Button startButton(BUTTON_PIN);
const Timer timer(TIMER_INIT_VALUE);

EthernetClient ethClient;
PubSubClient client;

unsigned long PING_INTERVAL = REPORT_INTERVAL;

void onMessage(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [ ");
  Serial.print(topic);
  Serial.println(" ] ");

  DynamicJsonDocument decoded(64);
  deserializeJson(decoded, payload);

  // NestJS MQTT message emitter adds "data" property
  const char *status = decoded["data"]["status"];

  Serial.print("Status: ");
  Serial.print(status);

  const bool turnOn = strcmp(status, ON) == 0;

  if (!turnOn) {
    timer.stop();
    timer.reset();
  } else {
    const int minutes = decoded["data"]["time"]["min"];
    const int seconds = decoded["data"]["time"]["sec"];

    Serial.print("; Time: ");
    Serial.print(minutes);
    Serial.print(":");
    Serial.print(seconds);
    Serial.println();

    timer.set(minutes, seconds);
    timer.start();
  }

  publishCurrentState();
}

void reconnect() {
  unsigned long lastReconnectAttempt = 0;
  unsigned long currentMillis = millis();

  if (currentMillis - lastReconnectAttempt < PING_INTERVAL) return;

  Serial.println("Attempting MQTT connection...");

  DynamicJsonDocument payload(128);

  payload["status"] = timer.isActive() ? ON : OFF;
  payload["code"] = DEVICE_CODE;
  payload["name"] = DEVICE_NAME;
  payload["type"] = DEVICE_TYPE;
  payload["version"] = DEVICE_VERSION;
  payload["time"] = timer.getValue();  // Seconds

  char MQTT_PAYLOAD[128];
  serializeJson(payload, MQTT_PAYLOAD);

  if (client.connect(
        MQTT_CLIENT_ID,  // Client ID
        MQTT_USER,       // Username
        MQTT_PASS,       // Password
        PUBLISH_TOPIC,   // Will topic
        MQTT_QOS,        // Will QoS
        MQTT_RETAIN,     // Will retain
        MQTT_PAYLOAD,    // Will payload
        false            // Clean session
        )) {
    Serial.println("Connected to MQTT broker!");
    Serial.print("Subscribing to topic: ");
    Serial.println(SUBSCRIBE_TOPIC);

    client.subscribe(SUBSCRIBE_TOPIC, MQTT_QOS);  // QoS 1, at least once delivery
    lastReconnectAttempt = 0;                     // Reset the reconnect attempt counter
    PING_INTERVAL = REPORT_INTERVAL;              // Reset the retry delay
    connectingLight.off();                        // Turn off when connected
    publishCurrentState();
  } else {
    Serial.print("Failed to connect, rc=");
    Serial.print(client.state());
    Serial.println(" Retrying in " + String(PING_INTERVAL / 1000) + " seconds");

    // Use exponential backoff for retry delay
    lastReconnectAttempt = currentMillis;
    PING_INTERVAL = min(2 * PING_INTERVAL, MAX_PING_TIMEOUT);  // Maximum retry delay of 30 seconds

    connectingLight.on();  // Turn on when trying to reconnect
  }
}

void publishCurrentState() {
  DynamicJsonDocument payload(128);

  payload["status"] = timer.isActive() ? ON : OFF;
  payload["code"] = DEVICE_CODE;
  payload["name"] = DEVICE_NAME;
  payload["type"] = DEVICE_TYPE;
  payload["version"] = DEVICE_VERSION;
  payload["time"] = timer.getValue();  // Seconds

  char buffer[128];
  serializeJson(payload, buffer);

  client.publish(PUBLISH_TOPIC, buffer);
}

void setup() {
  Serial.begin(9600);

  Ethernet.begin(MAC, IP);

  Serial.print("Device IP is: ");
  Serial.println(Ethernet.localIP());

  Serial.print("Default gateway is: ");
  Serial.println(Ethernet.gatewayIP());

  client.setServer(MQTT_HOST, MQTT_PORT);
  client.setClient(ethClient);
  client.setCallback(onMessage);

  startButton.begin();

  // Turn on when starting up
  // Indicates that device is trying to connect to MQTT broker
  // Once connected, it will turn off
  connectingLight.on();
}

void loop() {
  if (!client.connected()) reconnect();

  client.loop();
  timer.handle();
  startButton.handle();

  // Button click event
  if (startButton.resetClicked()) {
    timer.reset();          // Reset the timer, start over on button click
    timer.toggle();         // Toggle the timer state
    publishCurrentState();  // Notify MQTT broker of the change
  }

  // Only sets the relay state when the timer state changes
  // Otherwise, it skips the evaluation internally, to avoid unnecessary relay state change
  externalRelay.setState(timer.isActive());
}
