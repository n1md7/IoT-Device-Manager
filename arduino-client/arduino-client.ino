#include <SPI.h>
#include <Ethernet.h>
#include <ArduinoJson.h>
#include <AbleButtons.h>
#include <PubSubClient.h>

#include "ReconnectionManager.h"
#include "Configuration.h"
#include "Component.h"
#include "Timer.h"

#define ON "ON"
#define OFF "OFF"

using Button = AblePullupClickerButton;

const Component networkErrorLed(CON_LED_PIN);
const Component externalRelay(RELAY_PIN);
const Button startButton(BUTTON_PIN);
const Timer timer(TIMER_INIT_VALUE);

ReconnectionManager connectionManager(RECONNECT_TIMEOUT);

EthernetClient ethernetClient;
PubSubClient mqttClient;

void onMessage(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived [ ");
  Serial.print(topic);
  Serial.println(" ] ");

  DynamicJsonDocument decoded(256);
  deserializeJson(decoded, payload);

  // NestJS MQTT message emitter adds "data" property
  const char *status = decoded["data"]["status"];

  Serial.print("Status: ");
  Serial.print(status);

  const bool turnOn = strcmp(status, ON) == 0;

  if (turnOn) {
    const int minutes = decoded["data"]["time"]["min"];
    const int seconds = decoded["data"]["time"]["sec"];

    Serial.print("; Time: ");
    Serial.print(minutes);
    Serial.print(":");
    Serial.print(seconds);
    Serial.println();

    if (timer.set(minutes, seconds)) {
      timer.start();
      Serial.println("Timer started");
    } else {
      Serial.println("Error: Invalid time value");
    }
  } else {
    timer.stop();
    timer.reset();
  }

  publishCurrentState();
}

void mqttBrokerConnect() {
  Serial.println("Attempting MQTT connection...");

  char MQTT_PAYLOAD[128];
  serializeJson(forgePayload(), MQTT_PAYLOAD);

  const bool connected = mqttClient.connect(
    MQTT_CLIENT_ID,     // Client ID
    MQTT_USER,          // Username
    MQTT_PASS,          // Password
    PUBLISH_TOPIC,      // Will topic
    MQTT_QOS,           // Will QoS
    MQTT_RETAIN,        // Will retain
    MQTT_PAYLOAD,       // Will payload
    MQTT_CLEAN_SESSION  // Clean session
  );

  if (connected) {
    Serial.println("Connected to MQTT broker!");
    Serial.print("Subscribing to topic: ");
    Serial.println(SUBSCRIBE_TOPIC);

    mqttClient.subscribe(SUBSCRIBE_TOPIC, MQTT_QOS);  // QoS 1, at least once delivery
    networkErrorLed.off();                            // Turn off when connected
    publishCurrentState();
  } else {
    Serial.print("Failed to connect, rc=");
    Serial.print(mqttClient.state());
    Serial.println(" Retrying in " + String(RECONNECT_TIMEOUT / 1000) + " seconds");

    networkErrorLed.on();  // Turn on when trying to reconnect
  }
}

void publishCurrentState() {
  char MQTT_PAYLOAD[128];
  serializeJson(forgePayload(), MQTT_PAYLOAD);

  Serial.println("Serializing done.");
  Serial.print("Publishing current state: ");
  Serial.println(MQTT_PAYLOAD);

  mqttClient.publish(PUBLISH_TOPIC, MQTT_PAYLOAD, MQTT_RETAIN);
  Serial.println("Published");
}

DynamicJsonDocument forgePayload() {
  DynamicJsonDocument payload(256);

  payload["status"] = timer.isActive() ? ON : OFF;
  payload["code"] = DEVICE_CODE;
  payload["name"] = DEVICE_NAME;
  payload["type"] = DEVICE_TYPE;
  payload["version"] = DEVICE_VERSION;
  payload["time"] = timer.getValue();  // Seconds

  return payload;
}

void setup() {
  Serial.begin(9600);

  Ethernet.begin(MAC, IP);

  Serial.print("Device IP is: ");
  Serial.println(Ethernet.localIP());

  Serial.print("Default gateway is: ");
  Serial.println(Ethernet.gatewayIP());

  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setClient(ethernetClient);
  mqttClient.setCallback(onMessage);
  mqttClient.setKeepAlive(60); // Seconds

  startButton.begin();

  // Turn on when starting up
  // Indicates that device is trying to connect to MQTT broker
  // Once connected, it will turn off
  networkErrorLed.on();
  mqttBrokerConnect();
}

void loop() {
  mqttClient.loop();
  timer.handle();
  startButton.handle();

  if (!mqttClient.connected() && connectionManager.shouldReconnect()) {
    mqttBrokerConnect();
    connectionManager.updateTimestamp();
  }


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
