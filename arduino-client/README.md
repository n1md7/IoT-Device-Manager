## MQTT client for Arduino (IoT)

### Components

- Arduino(Mega) (https://store.arduino.cc/arduino-mega-2560-rev3)
- Ethernet Shield (https://store.arduino.cc/arduino-ethernet-shield-2)

## How to use

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
