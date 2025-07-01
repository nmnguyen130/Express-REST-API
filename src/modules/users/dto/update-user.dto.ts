import Joi from 'joi';

import { BaseJoiDto } from '@/shared/dto/base.dto';
import { userSchemas } from '../schemas/user.schemas';

export class UpdateUserDto extends BaseJoiDto {
  name?: string;
  email?: string;
  password?: string;

  static schema = Joi.object({
    name: userSchemas.name.optional(),
    email: userSchemas.email.optional(),
    password: userSchemas.password.optional(),
  })
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
}
