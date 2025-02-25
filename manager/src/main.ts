import { NestFactory } from '@nestjs/core';
import { AppModule } from '/src/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { Env } from '/libs/env/env.class';
import { version } from '../package.json';
import { dump } from 'js-yaml';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { cwd, pid } from 'node:process';
import { join } from 'node:path';
import { RequestLoggerInterceptor } from '/libs/interceptors';
import { RequestIdInterceptor } from '/libs/interceptors/request-id/request-id.interceptor';
import { ConfigService } from '/libs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Component } from '/src/components/entities/component.entity';
import { System } from '/src/systems/entities/system.entity';
import { Device } from '/src/devices/entities/device.entity';
import { HttpErrorSchema } from '/libs/filters/http-exception/http-error.schema';
import { HttpExceptionFilter } from '/libs/filters/http-exception/http-exception.filter';

(async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);

    configurePipes(app);
    configureInterceptors(app);
    configureFilters(app);

    configureApi(app);
    configureOrigin(app);

    configureSwagger(app);
    disableXPoweredByHeader(app);

    const appPort = config.getOrThrow('http.port', { infer: true });

    app.connectMicroservice<MicroserviceOptions>(config.getOrThrow('mqtt'));

    await app.startAllMicroservices();
    await app.listen(appPort, '0.0.0.0');

    const url = await app.getUrl();
    console.log(`
      Application started at: ${url}
      Swagger docs: ${url}/docs
      Mode: ${Env.NodeEnv}
      Pid: ${pid}
    `);
  } catch (error) {
    console.error('Server failed to start', error);
    process.exit(1);
  }
})();

function configureInterceptors(app: NestExpressApplication) {
  app.useGlobalInterceptors(new RequestIdInterceptor(), new RequestLoggerInterceptor());
}

function configureOrigin(app: NestExpressApplication) {
  app.enableCors({
    origin: (requestOrigin, callback) => {
      const corsWhitelist = process.env.ORIGIN.split(',');
      const originNotDefined = !requestOrigin;
      const isWhitelisted = corsWhitelist.indexOf(requestOrigin) !== -1;
      const isLocalhost = new RegExp(/^https?:\/\/(localhost|127.0.0.1)/).test(requestOrigin);
      const corsAllowed = originNotDefined || isLocalhost || isWhitelisted;

      if (corsAllowed) return callback(null, true);
      callback(new Error(`Origin [${requestOrigin}] Not allowed by CORS`));
    },
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type, Accept',
    exposedHeaders: 'Authorization, Content-Type',
    credentials: true,
  });
}

function configureFilters(app: NestExpressApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}

function configurePipes(app: NestExpressApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

function configureApi(app: NestExpressApplication) {
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}

function configureSwagger(app: NestExpressApplication) {
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
    {
      extraModels: [Component, System, Device, HttpErrorSchema],
    },
  );
  try {
    writeFileSync(join(cwd(), './docs/swagger.yaml'), dump(document));
  } catch (error) {
    Logger.error(`Error while writing swagger.yaml file: ${error}`, 'Bootstrap');
  }

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

function disableXPoweredByHeader(app: NestExpressApplication) {
  app.getHttpAdapter().getInstance().disable('x-powered-by');
}
