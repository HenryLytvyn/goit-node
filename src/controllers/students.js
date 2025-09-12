import createHttpError from 'http-errors';
import { getAllStudents, getStudentById } from '../services/students.js';

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
