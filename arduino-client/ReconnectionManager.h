#ifndef ReconnectionManager_h
#define ReconnectionManager_h

class ReconnectionManager {
public:
  ReconnectionManager(unsigned long timeout = 30000);  // Default timeout: 30 seconds
  void updateTimestamp();
  bool shouldReconnect();

private:
  unsigned long lastConnectionAttempt;
  unsigned long timeoutDuration;
};

#endif
