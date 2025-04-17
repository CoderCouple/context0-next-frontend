//import * as Sentry from "@sentry/nextjs";
import { AppError, PublicError } from "@/lib/errors";
import { ActionResponse } from "@/types";

export function handleServerError(err: unknown): ActionResponse<null> {
  if (err instanceof AppError) {
    if (!(err instanceof PublicError)) {
      //Sentry.captureException(err); // log internal errors
    }
    return {
      success: false,
      error: err.message,
      code: err.code,
      //statusCode: err.statusCode,
    };
  }

  // unknown/unexpected error
  //Sentry.captureException(err);
  return {
    success: false,
    error: "Something went wrong",
    code: "INTERNAL_ERROR",
    // statusCode: 500,
  };
}
