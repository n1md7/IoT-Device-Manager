import { RequestLoggerInterceptor } from './request-logger.interceptor';

describe('RequestLoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestLoggerInterceptor()).toBeDefined();
  });
});
