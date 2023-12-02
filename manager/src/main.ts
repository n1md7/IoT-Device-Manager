import { NestFactory } from '@nestjs/core';
import { AppModule } from '/src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { Env } from '/libs/env/env.class';
import { version } from '../package.json';
import { dump } from 'js-yaml';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { cwd, pid } from 'node:process';
import { join } from 'node:path';
import { GenericExceptionFilter } from '/libs/filters';
import { RequestLoggerInterceptor } from '/libs/interceptors';
import { RequestIdInterceptor } from '/libs/interceptors/request-id/request-id.interceptor';
import { TimeoutInterceptor } from '/libs/interceptors/timeout/timeout.interceptor';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
    new RequestLoggerInterceptor(),
    new TimeoutInterceptor(),
  );
  app.useGlobalFilters(new GenericExceptionFilter());

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT auth token',
        in: 'header',
      })
      .setTitle('Home Automation API')
      .setDescription('Home Automation API for IoT devices')
      .setVersion(version)
      .build(),
  );
  try {
    writeFileSync(join(cwd(), './docs/swagger.yaml'), dump(document));
  } catch (error) {
    Logger.error(
      `Error while writing swagger.yaml file: ${error}`,
      'Bootstrap',
    );
  }

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const appPort = parseInt('3000', 10);
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
        clientId: 'IoT-Manager',
        username: '',
        password: '',
        subscribeOptions: {
          /**
           * The QoS
           * 0 - at most once delivery
           * 1 - at least once delivery
           * 2 - exactly once delivery
           *
           * We use QoS 1 because we want to make sure that the message is delivered at least once.
           * Duplication is possible, but it is not a problem for us.
           * In worst case scenario, the device will receive the same message twice.
           * Which will cause triggering the same action twice (e.g. turn on the light twice).
           */
          qos: 1,
        },
      },
    },
    // { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(appPort, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`
    Application started at: ${url}
    Swagger docs: ${url}/docs
    Mode: ${Env.NodeEnv}
    Pid: ${pid}
  `);
})();
