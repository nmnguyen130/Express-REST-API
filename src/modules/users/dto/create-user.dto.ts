import Joi from 'joi';

import { BaseJoiDto } from '@/shared/dto/base.dto';
import { userSchemas } from '../schemas/user.schemas';

export class CreateUserDto extends BaseJoiDto {
  name: string = '';
  email: string = '';
  password: string = '';

  static schema = Joi.object({
    name: userSchemas.name.required(),
    email: userSchemas.email.required(),
    password: userSchemas.password.required(),
  });
}
