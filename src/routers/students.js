import { Router } from 'express';
import {
  getStudentByIdController,
  getStudentsController,
} from '../controllers/students.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const studentsRouter = Router();

studentsRouter.get('/students', ctrlWrapper(getStudentsController));
studentsRouter.get(
  '/students/:studentId',
  ctrlWrapper(getStudentByIdController),
);

export default studentsRouter;
