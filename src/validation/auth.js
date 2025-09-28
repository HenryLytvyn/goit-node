import Joi from 'joi';

const registerUserValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required,
  password: Joi.string().required(),
});

export default registerUserValidationSchema;
