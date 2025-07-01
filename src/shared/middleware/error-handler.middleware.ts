import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res);
  }
};

// Send error response in development environment
const sendErrorDev = (err: any, req: Request, res: Response) => {
  const isApi = req.originalUrl.startsWith('/api');
  // API
  if (isApi) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
    });
  }

  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

// Send error response in production environment
const sendErrorProd = (err: any, req: Request, res: Response) => {
  const isApi = req.originalUrl.startsWith('/api');
  // API
  if (isApi) {
    // 1. Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 2. Programming or other unknown error: don't leak error details
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }

  // RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.isOperational ? err.message : 'Please try again later.',
  });
};