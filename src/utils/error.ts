import { HttpStatusCode } from "axios";

export class HttpError extends Error {
  code: number;
  message: string;
  detail?: string;
  constructor(code: number, message: string, detail?: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.detail = detail;
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super(401, "Unauthorized");
  }
}

export class BadRequestException extends HttpError {
  constructor(message: string, detail?: string) {
    super(400, message, detail);
  }
}

export class NotAcceptableException extends HttpError {
  constructor() {
    super(406, "Not Acceptable");
  }
}

export class ForbiddenError extends HttpError {
  constructor() {
    super(403, "Unauthorized access");
  }
}

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export class WhatsappTemplateError extends Error {
  constructor() {
    super();
  }
}

export class BookingNotFoundException extends HttpError {
  constructor() {
    super(404, "Booking not found", "Please verify URL");
  }
}

export class NotFoundException extends HttpError {
  constructor() {
    super(HttpStatusCode.NotFound, "Page not found", "Please verify URL");
  }
}
