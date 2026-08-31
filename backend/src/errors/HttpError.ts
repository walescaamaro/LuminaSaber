export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly issues?: unknown[];

  constructor(statusCode: number, message: string, issues?: unknown[]) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.issues = issues;
  }
}
