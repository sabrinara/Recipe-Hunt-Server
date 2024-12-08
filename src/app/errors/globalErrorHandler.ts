import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './AppError';
import SendResponse from '../utils/sendResponse';


const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Zod errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((error) => error.message);
    return SendResponse(res, 400, 'fail', 'Invalid input data', errors);
  }

  // Mongoose errors or custom AppError handling can be added here

  // Send default error response
  return SendResponse(res, err.statusCode, err.status, err.message, err.stack);
};

export default globalErrorHandler;
