// import { Router } from 'express';
// import {
//   createStudentController,
//   deleteStudentController,
//   getStudentByIdController,
//   getStudentsController,
//   updateStudentController,
//   upsertStudentController,
// } from '../controllers/students.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import {
//   createStudentValSchema,
//   updateStudentValSchema,
// } from '../validation/students.js';
// import isValidId from '../middlewares/isValidId.js';

// const studentsRouter = Router();

// studentsRouter.get('/students', getStudentsController);
// studentsRouter.get('/students/:studentId', isValidId, getStudentByIdController);
// studentsRouter.post(
//   '/students',
//   validateBody(createStudentValSchema),
//   createStudentController,
// );
// studentsRouter.delete(
//   '/students/:studentId',
//   isValidId,
//   deleteStudentController,
// );
// studentsRouter.patch(
//   '/students/:studentId',
//   isValidId,
//   validateBody(updateStudentValSchema),
//   updateStudentController,
// );
// studentsRouter.put(
//   '/students/:studentId',
//   isValidId,
//   validateBody(updateStudentValSchema),
//   upsertStudentController,
// );

// export default studentsRouter;

//!========================================

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

const studentsRouter = Router();

studentsRouter
  .get('/students', getStudentsController)
  .post(
    '/students',
    validateBody(createStudentValSchema),
    createStudentController,
  );

studentsRouter.use('/students/:studentId', isValidId);

studentsRouter
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
