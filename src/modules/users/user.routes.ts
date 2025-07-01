import { Router } from 'express';

import { validateJoi } from '@/shared/middleware/validation.middleware';
import { asyncHandler } from '@/shared/utils/async-handler';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParamsDto } from './dto/user-params.dto';
import UserController from './user.controller';
import UserService from './user.service';

export class UserRoutes {
  public router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    const userService = new UserService();
    this.controller = new UserController(userService);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all users without pagination (use with caution for large datasets)
    this.router.get('/', 
      asyncHandler((req, res) => this.controller.getAllUsers(req, res))
    );

    // Get all users with pagination (query params)
    this.router.get('/paginated', 
      asyncHandler((req, res) => this.controller.getUsersPaginated(req, res))
    );

    // Get user by ID
    this.router.get(
      '/:id',
      validateJoi(UserParamsDto, 'params'),
      asyncHandler((req, res) => this.controller.getUserById(req, res))
    );

    // Create a new user
    this.router.post(
      '/',
      validateJoi(CreateUserDto, 'body'),
      asyncHandler((req, res) => {
        req.validated = req.body;
        return this.controller.create(req, res);
      })
    );

    // Update a user
    this.router.put(
      '/:id',
      [
        validateJoi(UserParamsDto, 'params'),
        validateJoi(UpdateUserDto, 'body')
      ],
      asyncHandler((req, res) => {
        req.validated = req.body;
        return this.controller.update(req, res);
      })
    );

    // Delete a user
    this.router.delete(
      '/:id',
      validateJoi(UserParamsDto, 'params'),
      asyncHandler((req, res) => this.controller.delete(req, res))
    );
  }
}

export default new UserRoutes().router;
