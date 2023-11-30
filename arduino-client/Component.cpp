#include "Component.h"

Component::Component(int pin) {
  this->pin = pin;
  this->state = LOW;
  this->offSignal = LOW;
  this->onSignal = HIGH;

  pinMode(pin, OUTPUT);
  digitalWrite(pin, state);
}

Component::Component(int pin, int offSignal, int onSignal) {
  this->pin = pin;
  this->state = offSignal;
  this->onSignal = onSignal;
  this->offSignal = offSignal;

  pinMode(pin, OUTPUT);
  digitalWrite(pin, state);
}

void Component::on() {
  if (isOn()) return;

  state = onSignal;
  digitalWrite(pin, state);
}

void Component::off() {
  if (isOff()) return;

  state = offSignal;
  digitalWrite(pin, state);
}

bool Component::isOn() {
  return state == onSignal;
}

bool Component::isOff() {
  return state == offSignal;
}

void Component::toggle() {
  if (isOn()) return off();

  on();
}

void Component::setState(bool isOn) {
  state = isOn ? onSignal : offSignal;
  digitalWrite(pin, state);
}
