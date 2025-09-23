import createHttpError from 'http-errors';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  upsertStudent,
} from '../services/students.js';
import parsePaginationParams from '../utils/parsPaginationParams.js';

export async function getStudentsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.params);
  const students = await getAllStudents({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
}

export async function getStudentByIdController(req, res, next) {
  const { studentId } = req.params;
  const student = await getStudentById(studentId);

  if (!student) {
    next(createHttpError(404, "Student hasn't found"));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
}

export async function createStudentController(req, res) {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: 'Student successfully added to data base!',
    data: student,
  });
}

export async function deleteStudentController(req, res, next) {
  const { studentId } = req.params;
  const isStudentDelete = await deleteStudent(studentId);

  if (!isStudentDelete) {
    return next(createHttpError(404, 'Student not found!'));
  }

  res.status(204).send();
}

export async function updateStudentController(req, res, next) {
  const { studentId } = req.params;
  const result = updateStudent(studentId, req.body);

  if (!result) {
    createHttpError(404, 'Student not found!');
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Student data successfully updated!',
    data: result.student,
  });
}

export async function upsertStudentController(req, res, next) {
  const { studentId } = req.params;

  const result = upsertStudent(studentId, req.body, { upsert: true });

  // if (!result) {
  //   next(createHttpError(404, 'Student not found!'));
  //   return;
  // }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.student,
  });
}
