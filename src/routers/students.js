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
import checkRoles from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/constants.js';
import upload from '../middlewares/multer.js';

const studentsRouter = Router();

studentsRouter
  .use('/students', authenticate)
  .get('/students', checkRoles(ROLES.TEACHER), getStudentsController)
  .post(
    '/students',
    checkRoles(ROLES.TEACHER),
    upload.single('photo'),
    validateBody(createStudentValSchema),
    createStudentController,
  );

studentsRouter
  .use('/students/:studentId', isValidId)
  .get(
    '/students/:studentId',
    checkRoles(ROLES.TEACHER, ROLES.PARENT),
    getStudentByIdController,
  )
  .delete(
    '/students/:studentId',
    checkRoles(ROLES.TEACHER),
    deleteStudentController,
  )
  .patch(
    '/students/:studentId',
    checkRoles(ROLES.TEACHER, ROLES.PARENT),
    upload.single('photo'),
    validateBody(updateStudentValSchema),
    updateStudentController,
  )
  .put(
    '/students/:studentId',
    checkRoles(ROLES.TEACHER),
    upload.single('photo'),
    validateBody(createStudentValSchema),
    upsertStudentController,
  );

export default studentsRouter;
