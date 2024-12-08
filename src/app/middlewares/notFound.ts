import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';


const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export default notFoundRoute;
