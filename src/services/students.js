import { StudentsCollection } from '../db/models/students.js';
import calcPaginData from '../utils/calcPaginData.js';

export async function getAllStudents({ page, perPage }) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  const studentsCount = await StudentsCollection.find()
    .merge(studentsQuery)
    .countDocuments();

  const students = await studentsQuery.skip(skip).limit(limit).exec();

  const paginationData = calcPaginData(studentsCount, page, perPage);

  return {
    data: students,
    ...paginationData,
  };

  // const students = await StudentsCollection.find();
  // return students;
}

export async function getStudentById(studentId) {
  const student = await StudentsCollection.findById(studentId);
  return student;
}

export async function createStudent(payload) {
  const student = await StudentsCollection.create(payload);
  // const student = new StudentsCollection(payload);
  // await student.save();
  return student;
}

export async function deleteStudent(studentId) {
  const student = await StudentsCollection.findById(studentId);
  let isStudentDelete;

  if (!student) {
    isStudentDelete = false;
    return isStudentDelete;
  }

  await StudentsCollection.findByIdAndDelete(studentId);
  isStudentDelete = true;
  return isStudentDelete;
}

export async function updateStudent(studentId, payload) {
  const student = StudentsCollection.findByIdAndUpdate(studentId, payload, {
    // "new: true" is required for some reason
    new: true,
  });

  return student;
}

export async function upsertStudent(studentId, payload) {
  const student = await getStudentById(studentId);

  if (!student) {
    const student = await StudentsCollection.create({
      _id: studentId,
      ...payload,
    });

    return {
      student,
      isNew: true,
    };
  } else {
    const student = await updateStudent(studentId, payload);

    return { student, isNew: false };
  }
}
