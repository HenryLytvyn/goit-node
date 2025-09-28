import { registerUser } from '../services/auth.js';

export async function registerUserController(req, res, next) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User created successfully!',
    data: user,
  });
}
