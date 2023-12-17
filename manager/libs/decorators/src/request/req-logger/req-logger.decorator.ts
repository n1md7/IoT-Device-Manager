import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { HttpRequest } from '/libs/interceptors/request.type';

export const ReqLogger = createParamDecorator((data: never, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest<HttpRequest>().logger;
});
