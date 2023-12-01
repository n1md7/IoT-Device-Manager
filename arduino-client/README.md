## MQTT client for Arduino (IoT)

### Components

- Arduino(Mega) (https://store.arduino.cc/arduino-mega-2560-rev3)
- Ethernet Shield (https://store.arduino.cc/arduino-ethernet-shield-2)

## How to use

### Create `Configuration.h` file

Modify values according to your setup

```cpp
#define DEVICE_CODE "D0001"
#define DEVICE_NAME "Water Pump"
#define REPORT_INTERVAL 5000    // 5s, how often report to MQTT broker
#define MAX_PING_TIMEOUT 30000  // Maximum retry delay of 30 seconds, when MQTT broker is not available

#define TIMER_INIT_VALUE 15 * 60  // 15 minutes

#define RELAY_PIN 2    // Relay pin to control the water pump
#define CON_LED_PIN 3  // LED pin to indicate the connection status
#define BUTTON_PIN 4   // Button pin to control the water pump ON/OFF

const byte MAC[] = { 0xE4, 0x5F, 0x01, 0xC5, 0xBB, 0xA9 };  // Arduino shield MAC
const byte IP[] = { 192, 168, 116, 124 };                   // Arduino shield IP

// MQTT broker configuration
#define MQTT_CLIENT_ID DEVICE_NAME " (" DEVICE_CODE ")"
#define MQTT_HOST "192.168.116.154"
#define MQTT_PORT 1883
#define MQTT_QOS 1 // Quality of Service, 0 - at most once, 1 - at least once, 2 - exactly once

// If you don't need authentication, make sure they are empty
#define MQTT_USER "user"
#define MQTT_PASS "secret"

#define SUBSCRIBE_TOPIC "home/devices/" DEVICE_CODE "/set"
#define PUBLISH_TOPIC "home/devices/" DEVICE_CODE "/state"
```

### Compile and upload

```bash
arduino-cli compile --profile mega
arduino-cli upload --port /dev/cu.usbmodem144101 --profile mega
```

```bash
arduino-cli compile --profile uno
arduino-cli upload --port /dev/cu.usbmodem144101 --profile uno
```

__NOTE__: All dependencies are installed automatically

## Manual step by step

### Compile

Prerequisites:

- arduino-cli installed (https://arduino.github.io/arduino-cli/latest/installation/)
- arduino:avr:mega board installed (`arduino-cli core install arduino:avr`)
- arduino:avr:ethernet board installed (`arduino-cli core install arduino:avr`)
- Ethernet library installed (`arduino-cli lib install Ethernet`)
- PubSubClient library installed (`arduino-cli lib install PubSubClient`)

__NOTE__: The board can be changed to any other board that is supported by the arduino-cli

```bash
arduino-cli compile -b arduino:avr:mega arduino-client.ino
```

### Upload

```bash
arduino-cli upload -p /dev/cu.usbmodem144101 -b arduino:avr:mega arduino-client.ino
```

__NOTE__: The port can be changed to the port that the arduino is connected to (`/dev/cu.usbmodem144101` is the port for
my arduino)

Check available ports:

MacOS:
```bash
arduino-cli board list
# or
ls -l /dev/cu.*
# or
ls -l /dev/tty.*
# or
ls -l /dev/*.*
```
__NOTE__: Plugin & unplug Arduino to check which port is added to the list
