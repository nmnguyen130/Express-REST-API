import Joi from 'joi';

export const userSchemas = {
  name: Joi.string()
    .min(2)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
};
