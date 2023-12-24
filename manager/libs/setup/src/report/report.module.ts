import { Global, Module } from '@nestjs/common';
import { ReportService } from '/libs/setup/report/report.service';

@Global()
@Module({
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
