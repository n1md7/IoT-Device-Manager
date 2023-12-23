# Device Manager

## Description

The Device Manager service is responsible for overseeing IoT devices. The initial database and system setup support one
device per type. For instance, there can only be one switch and one sensor connected to a single microcontroller. It is
not permissible to have two switches connected to one microcontroller unless they contribute to the same functionality.

For example, if a water pump and a valve are connected to one microcontroller, they both contribute to the same
functionality. It can be a switch-type device; when it is turned on, it opens the valve and activates the pump. When it
is turned off, it closes the valve and deactivates the pump. This is acceptable.

However, if two water pumps are connected to one microcontroller, and they are doing totally different things, it is not
acceptable. In this case, two microcontrollers are required.

Currently, it supports the following device types:

- Switch (Code: `SWITCH`) to control a device (e.g., light, pump, etc.)
- Sensor (Code: `SENSOR`) to measure a value (e.g., temperature, humidity, etc.)

### Switch

A switch is a component type that can turn ON or OFF the connected device.

The electrical device behind this component can be anything that has two states: ON or OFF and can be controlled by a
3.3V or 5V signal.

It has two-way communication. It can send the current state to the server and can receive the new state from the server.

Initially, it receives the current state and reports back when the state changes.

The initial state contains the following information:

- State (ON or OFF)
- Time when the state needs to change to OFF (if it is ON)
  It is a JSON payload that contains the following information:
  ```json
  {
    "status": "ON",
    "time": {
      "min": 10,
      "sec": 15
    }
  }
  ```

Each switch comes equipped with a built-in timer functionality. While it can be manually turned off, it also features an
automatic shutdown after a predetermined time interval. This robust approach ensures that even if the Device Manager
experiences an unexpected outage, the device will autonomously power down after the specified duration.

__NOTE__: _The time interval is expressed in both minutes and seconds, with a maximum limit set at 99 minutes and 59
seconds. This limitation is in place as a security measure, preventing the allowance of longer time intervals. If a
duration beyond this limit is needed, it can be accomplished by reissuing the command, thereby resetting the current
timer and extending the time interval. The Device Manager scheduler adeptly manages this process. In situations where
the Device Manager is offline and the timer is active, the duration cannot exceed 99 minutes and 59 seconds, ensuring a
proactive approach to security concerns._

### Sensor

A sensor is a device that can measure a value. The electrical component behind this device is any type of sensor. It
only has one-way communication, just sending the measured value to the server.

## Installation

```bash
$ nvm use
$ npm install
```

## Running Device Manager

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
