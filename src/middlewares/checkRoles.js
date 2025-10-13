import createHttpError from 'http-errors';
import { ROLES } from '../constants/constants.js';
import { StudentsCollection } from '../db/models/students.js';

export default function checkRoles(...roles) {
  return async function (req, res, next) {
    const { user } = req;
    if (!user) {
      return next(createHttpError(401, 'User not found!'));
    }

    const { role } = user;

    if (roles.includes(ROLES.TEACHER) && role === ROLES.TEACHER) {
      next();
      return;
    }

    if (roles.includes(ROLES.PARENT) && role === ROLES.PARENT) {
      const { studentId } = req.params;
      if (!studentId) {
        next(createHttpError(403, 'Student id was not found!'));
        return;
      }

      const student = await StudentsCollection.findOne({
        _id: studentId,
        parentId: user._id,
      });

      if (student) return next();
    }

    next(createHttpError(403, 'You do not have access to this data!'));
  };
}
