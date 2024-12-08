// utils/SendResponse.ts
import { Response } from 'express';

type Meta = {
  total: number;
  page: number;
  limit: number;
};

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  meta?: Meta;
};

/**
 * A utility function to send consistent HTTP responses.
 * @param res - Express Response object.
 * @param statusCode - HTTP status code.
 * @param status - Status string ('success' or 'error').
 * @param message - Optional message to include in the response.
 * @param data - Optional data object to include in the response.
 * @param meta - Optional metadata for paginated responses.
 */
const SendResponse = <T>(
  res: Response,
  statusCode: number,
  status: string,
  message?: string,
  data?: T,
  meta?: Meta
) => {
  const response: TResponse<T> = {
    success: status === 'success',
    statusCode,
    message,
    data,
  };

  // If meta exists, add it to the response
  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

export default SendResponse;
