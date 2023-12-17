import { HttpStatus } from '@nestjs/common';

export type ErrorPayloadType = {
  message: string;
  error?: unknown | null;
  code?: HttpStatus;
};

export class DatabaseException extends Error {
  /**
   * @description Error details
   *
   * It is meant to be logged internally, not to be exposed to the user.
   *
   * On the other hand, the `message` property is meant to be exposed to the user.
   */
  readonly details;
  readonly code?: number;

  constructor(exception: ErrorPayloadType) {
    super(exception.message);

    this.code = exception.code;
    this.name = this.constructor.name;
    this.details = this.extractDetails(exception);

    Error.captureStackTrace(this, this.constructor);
  }

  private extractDetails(exception: ErrorPayloadType) {
    const extracted = {
      message: this.message,
      error: 'Empty',
    };

    return this.extracted(exception, extracted);
  }

  private extracted(exception: ErrorPayloadType, extracted: { message: string; error: string }) {
    if (exception.error instanceof Error) return (extracted.error = exception.error.message);

    if (typeof exception.error === 'string') return (extracted.error = exception.error);

    if (typeof exception.error === 'object') return (extracted.error = JSON.stringify(exception.error));

    return extracted;
  }
}
