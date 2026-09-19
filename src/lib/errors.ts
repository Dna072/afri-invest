export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(code: string, message: string, status = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function apiErrorPayload(error: unknown, requestId: string) {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
          requestId,
          details: error.details,
        },
      },
    };
  }
  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
        requestId,
      },
    },
  };
}
