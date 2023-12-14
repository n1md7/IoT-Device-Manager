import { Module } from '@nestjs/common';
import { ConfigModule } from '/libs/config';
import { DatabaseModule } from '/libs/setup/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
})
export class SetupModule {}
