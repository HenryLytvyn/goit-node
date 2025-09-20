import Joi from 'joi';
import GENDERS from '../constants/genders.js';

export const createStudentValSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string',
    'string.min': "Username can't be shorter {#limit} characters",
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  age: Joi.number().integer().min(6).max(16).required(),
  gender: Joi.string()
    .valid(...Object.values(GENDERS))
    .required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),
});

export const updateStudentValSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  age: Joi.number().integer().min(6).max(16),
  gender: Joi.string().valid(...Object.values(GENDERS)),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});
