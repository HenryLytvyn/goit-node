import createHttpError from 'http-errors';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  upsertStudent,
} from '../services/students.js';

export async function getStudentsController(req, res) {
  const students = await getAllStudents();

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
    throw createHttpError(404, "Student hasn't found");
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

export async function deleteStudentController(req, res) {
  const { studentId } = req.params;

  // const student =
  await deleteStudent(studentId);

  // if (!student) {
  //   createHttpError(404, 'Student not found!');
  //   return;
  // }

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
