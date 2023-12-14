import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '/libs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getOrThrow('database'),
    }),
  ],
})
export class DatabaseModule {}
