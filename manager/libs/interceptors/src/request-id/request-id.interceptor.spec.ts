import { RequestIdInterceptor } from './request-id.interceptor';

describe('RequestIdInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestIdInterceptor()).toBeDefined();
  });
});
