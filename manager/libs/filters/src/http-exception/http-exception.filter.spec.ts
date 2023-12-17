import { HttpExceptionFilter } from './http-exception.filter';

describe('GenericExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });
});
