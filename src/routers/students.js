import { Router } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getStudentByIdController,
  getStudentsController,
  updateStudentController,
  upsertStudentController,
} from '../controllers/students.js';

import { validateBody } from '../middlewares/validateBody.js';
import {
  createStudentValSchema,
  updateStudentValSchema,
} from '../validation/students.js';

import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';

const studentsRouter = Router();

studentsRouter
  .use('/students', authenticate)
  .get('/students', getStudentsController)
  .post(
    '/students',
    validateBody(createStudentValSchema),
    createStudentController,
  );

studentsRouter
  .use('/students/:studentId', isValidId)
  .get('/students/:studentId', getStudentByIdController)
  .delete('/students/:studentId', deleteStudentController)
  .patch(
    '/students/:studentId',
    validateBody(updateStudentValSchema),
    updateStudentController,
  )
  .put(
    '/students/:studentId',
    validateBody(createStudentValSchema),
    upsertStudentController,
  );

export default studentsRouter;
