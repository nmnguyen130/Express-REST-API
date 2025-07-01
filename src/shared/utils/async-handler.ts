import { Request, RequestHandler, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to automatically catch errors and pass them to Express's error middleware.
 * 
 * @param handler Async function that handles the route logic
 * @returns Express middleware that handles async errors
 * 
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.findAll();
 *   res.json(users);
 * }));
 */
export function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
