import { NodeEnv } from '/libs/env/env.enum';
import { env } from 'node:process';

export class Env {
  public static get NodeEnv(): NodeEnv {
    const nodeEnv = (env.NODE_ENV || '').trim() as NodeEnv;

    if (!nodeEnv) throw new TypeError('NODE_ENV is not defined');

    return nodeEnv;
  }

  public static get isDev() {
    return Env.NodeEnv === NodeEnv.DEV;
  }

  public static get isProd() {
    return Env.NodeEnv === NodeEnv.PROD;
  }

  public static get isTest() {
    return Env.NodeEnv === NodeEnv.TEST;
  }

  public static get isE2E() {
    return env.E2E === NodeEnv.E2E;
  }
}
