import { StudentsCollection } from '../db/models/students.js';

export async function getAllStudents() {
  const students = await StudentsCollection.find();
  return students;
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
  // await StudentsCollection.findOneAndDelete({
  //   _id: studentId,
  // });

  await StudentsCollection.findByIdAndDelete(studentId);
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
