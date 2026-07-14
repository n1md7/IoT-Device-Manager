/**
 * Tiny internal helpers for the Express library. Kept self-contained on purpose:
 * the library must not import application modules (e.g. the host project's
 * `utils/validations`, which transitively pulls in domain types). Anything the
 * router/express need that isn't a Moddable built-in lives here.
 */
import { HttpError, type ResponseStatus } from "express/router";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  return String(error);
};

export const getErrorStatus = (
  error: unknown,
  fallback: ResponseStatus = 500,
): ResponseStatus => {
  return error instanceof HttpError ? error.status : fallback;
};
