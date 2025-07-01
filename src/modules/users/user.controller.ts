import { Request, Response } from 'express';

import { HttpStatus } from '@/shared/constants/http-status';
import { ApiResponse } from '@/shared/utils/api-response';
import { PaginationUtils } from '@/shared/utils/pagination';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserParamsDto } from './dto/user-params.dto';
import UserService from './user.service';

class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get all users without pagination
   */
  public async getAllUsers(_: Request, res: Response): Promise<Response> {
    const users = await this.userService.getAllUsers();
    return res.status(HttpStatus.OK).json(ApiResponse.success(users, 'Users retrieved successfully'));
  }

  /**
   * Get all users with pagination
   */
  public async getUsersPaginated(req: Request, res: Response): Promise<Response> {
    const pagination = PaginationUtils.getPaginationParams(req, {
      defaultLimit: 10,
      maxLimit: 100
    });
    
    const { data: users, total } = await this.userService.getUsersPaginated(pagination);
    
    const paginatedResponse = PaginationUtils.createPaginatedResponse(
      req,
      users,
      total,
      { defaultLimit: 10, maxLimit: 100 }
    );
    
    return res.status(HttpStatus.OK).json(
      ApiResponse.success(paginatedResponse, 'Users retrieved successfully')
    );
  }

  /**
   * Get user by ID
   */
  public async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params as unknown as UserParamsDto;
    const user = await this.userService.getUserById(Number(id));
    
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json(
        ApiResponse.error('User not found', 'NOT_FOUND')
      );
    }
    
    return res.status(HttpStatus.OK).json(
      ApiResponse.success(user, 'User retrieved successfully')
    );
  }

  /**
   * Create a new user
   */
  public async create(req: Request, res: Response): Promise<Response> {
    const userData = req.validated as CreateUserDto;
    const user = await this.userService.create(userData);
    
    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success(user, 'User created successfully')
    );
  }

  /**
   * Update a user
   */
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params as unknown as UserParamsDto;
    const userData = req.body as UpdateUserDto;
    
    const updated = await this.userService.update(Number(id), userData);
    if (!updated) {
      return res.status(HttpStatus.NOT_FOUND).json(
        ApiResponse.error('User not found', 'NOT_FOUND')
      );
    }
    
    const user = await this.userService.getUserById(Number(id));
    return res.status(HttpStatus.OK).json(
      ApiResponse.success(user, 'User updated successfully')
    );
  }

  /**
   * Delete a user
   */
  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params as unknown as UserParamsDto;
    const deleted = await this.userService.delete(Number(id));
    
    if (!deleted) {
      return res.status(HttpStatus.NOT_FOUND).json(
        ApiResponse.error('User not found', 'NOT_FOUND')
      );
    }
    
    return res.status(HttpStatus.OK).json(
      ApiResponse.success(null, 'User deleted successfully')
    );
  }
}

export default UserController;
