import { env } from 'node:process';
import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Configuration } from '/libs/config/configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env.${env.NODE_ENV}`,
      load: [Configuration],
      isGlobal: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
