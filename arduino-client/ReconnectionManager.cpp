#include <Arduino.h>
#include "ReconnectionManager.h"

ReconnectionManager::ReconnectionManager(unsigned long timeout) {
  timeoutDuration = timeout;
  lastConnectionAttempt = 0;
}

void ReconnectionManager::updateTimestamp() {
  lastConnectionAttempt = millis();
}

bool ReconnectionManager::shouldReconnect() {
  return (millis() - lastConnectionAttempt >= timeoutDuration);
}
