import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { MqttRequest } from '/libs/interceptors/request.type';

export const MsgLogger = createParamDecorator((data: never, ctx: ExecutionContext) => {
  return ctx.switchToRpc().getContext<MqttRequest>().logger;
});
