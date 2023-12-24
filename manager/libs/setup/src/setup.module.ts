import { Module } from '@nestjs/common';
import { ConfigModule } from '/libs/config';
import { DatabaseModule } from '/libs/setup/database.module';
import { ReportModule } from '/libs/setup/report/report.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ReportModule],
})
export class SetupModule {}
