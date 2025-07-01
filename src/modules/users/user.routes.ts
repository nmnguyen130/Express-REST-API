import { Router, Request, Response } from 'express';

import { ErrorCodes } from '@/shared/constants/error-codes';
import { HttpStatus } from '@/shared/constants/http-status';
import { validateJoi } from '@/shared/middleware/validation.middleware';
import { ApiResponse } from '@/shared/utils/api-response';
import { asyncHandler } from '@/shared/utils/async-handler';
import { PaginationUtils } from '@/shared/utils/pagination';

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
    this.router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const users = await this.controller.getAllUsers();
      res.status(HttpStatus.OK).json(ApiResponse.success(users, 'Users retrieved successfully'));
    }));

    // Get all users with pagination (query params)
    this.router.get('/paginated', asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const pagination = PaginationUtils.getPaginationParams(req, {
        defaultLimit: 10,
        maxLimit: 100
      });
      
      const { data: users, total } = await this.controller.getUsersPaginated(pagination);
      
      const paginatedResponse = PaginationUtils.createPaginatedResponse(
        req,
        users,
        total,
        { defaultLimit: 10, maxLimit: 100 }
      );
      
      res.status(HttpStatus.OK).json(
        ApiResponse.success(
          paginatedResponse,
          'Users retrieved successfully'
        )
      );
    }));

    // Get user by ID
    this.router.get(
      '/:id',
      validateJoi(UserParamsDto, 'params'),
      asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const user = await this.controller.getUserById(req);
        if (!user) {
          res.status(HttpStatus.NOT_FOUND).json(
            ApiResponse.error('User not found', ErrorCodes.NOT_FOUND.code)
          );
          return;
        }
        
        res.status(HttpStatus.OK).json(ApiResponse.success(user, 'User retrieved successfully'));
      })
    );

    // Create new user
    this.router.post(
      '/',
      validateJoi(CreateUserDto),
      asyncHandler(async (req: Request, res: Response): Promise<void> => {
        // Attach validated data to the request object
        (req as any).validated = req.body;
        const user = await this.controller.create(req);
        res.status(HttpStatus.CREATED).json(
          ApiResponse.success(user, 'User created successfully')
        );
      })
    );

    // Update user
    this.router.put(
      '/:id',
      [
        validateJoi(UserParamsDto, 'params'),
        validateJoi(UpdateUserDto)
      ],
      asyncHandler(async (req: Request, res: Response): Promise<void> => {
        // Attach validated data to the request object
        (req as any).validated = req.body;
        const user = await this.controller.update(req);
        if (!user) {
          res.status(HttpStatus.NOT_FOUND).json(
            ApiResponse.error('User not found', ErrorCodes.NOT_FOUND.code)
          );
          return;
        }
        
        res.status(HttpStatus.OK).json(
          ApiResponse.success(user, 'User updated successfully')
        );
      })
    );

    // Delete user
    this.router.delete(
      '/:id',
      validateJoi(UserParamsDto, 'params'),
      asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const success = await this.controller.delete(req);
        if (!success) {
          res.status(HttpStatus.NOT_FOUND).json(
            ApiResponse.error('User not found', ErrorCodes.NOT_FOUND.code)
          );
          return;
        }
        
        res.status(HttpStatus.OK).json(
          ApiResponse.success({ deleted: true }, 'User deleted successfully')
        );
      })
    );  
  }
}

export default new UserRoutes().router;
