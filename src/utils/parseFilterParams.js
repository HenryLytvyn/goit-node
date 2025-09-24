import { GENDERS } from '../constants/constants.js';

export default function parseFilterParams({
  gender,
  maxAge,
  minAge,
  maxAvgMark,
  minAvgMark,
}) {
  const parsedGender = parseGender(gender);
  const parsedMaxAge = parseAge(maxAge);
  const parsedMinAge = parseAge(minAge);
  const parsedMaxAvgMark = parseAvgMark(maxAvgMark);
  const parsedMinAvgMark = parseAvgMark(minAvgMark);

  return {
    gender: parsedGender,
    maxAge: parsedMaxAge,
    minAge: parsedMinAge,
    maxAvgMark: parsedMaxAvgMark,
    minAvgMark: parsedMinAvgMark,
  };
}

function parseGender(gender) {
  if (!isString(gender)) return;

  const isGenderValid = Object.values(GENDERS).includes(gender);
  if (isGenderValid) return gender;
}

function parseAge(age) {
  if (!isString(age)) return;

  const parsedAge = parseInt(age);
  if (Number.isNaN(parsedAge)) return;

  return parsedAge;
}

function parseAvgMark(avgMark) {
  if (!isString(avgMark)) return;

  const parsedAvgMark = parseFloat(avgMark);
  if (Number.isNaN(parsedAvgMark)) return;
  return parsedAvgMark;
}

function isString(value) {
  return typeof value === 'string';
}
