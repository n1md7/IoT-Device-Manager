import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  sentryReport(error: unknown) {
    try {
      const extracted = this.extractMessage(error);
      this.logger.error(extracted.message, extracted.stack);
    } catch {
      this.logger.fatal(JSON.stringify(error));
    } finally {
      this.logger.debug(`This message would have been reported to Sentry!`);
    }
  }

  private extractMessage(error: unknown) {
    if (error instanceof Error) return { message: error.message, stack: '' };
    if (error instanceof HttpException) return { message: error.message, stack: error.stack };

    throw new Error('Unknown Error type');
  }
}
