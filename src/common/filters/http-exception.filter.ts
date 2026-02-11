import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorDetail = {
  field?: string;
  message: string;
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusReasonPhrase(status: number) {
  const raw = HttpStatus[status];
  if (typeof raw === 'string') {
    return toTitleCase(raw.replace(/_/g, ' '));
  }
  return 'Error';
}

function detailFromMessage(item: unknown): ErrorDetail {
  if (typeof item === 'string') {
    const parts = item.split(' ');
    if (parts.length > 1) {
      return { field: parts[0], message: parts.slice(1).join(' ') };
    }
    return { message: item };
  }
  if (typeof item === 'object' && item !== null) {
    const obj = item as { field?: unknown; message?: unknown };
    const message =
      typeof obj.message === 'string' ? obj.message : JSON.stringify(obj);
    if (typeof obj.field === 'string') {
      return { field: obj.field, message };
    }
    return { message };
  }
  return { message: String(item) };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'Unexpected error';
    let details: ErrorDetail[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      error = statusReasonPhrase(status);

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as {
          message?: unknown;
          error?: unknown;
        };

        if (typeof body.error === 'string') {
          error = body.error;
        }

        if (Array.isArray(body.message)) {
          message = 'Validation failed';
          details = body.message.map(detailFromMessage);
        } else if (typeof body.message === 'string') {
          message = body.message;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
