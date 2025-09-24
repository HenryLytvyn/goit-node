import { SORT_ORDER } from '../constants/constants.js';

export default function parseSortParams({ sortBy, sortOrder }) {
  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}

function parseSortOrder(sortOrder) {
  const isValidOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isValidOrder) return sortOrder;
  return SORT_ORDER.ASC;
}

function parseSortBy(sortBy) {
  const keysOfStudents = [
    '_id',
    'name',
    'age',
    'gender',
    'avgMark',
    'onDuty',
    'createdAt',
    'updatedAt',
  ];

  if (keysOfStudents.includes(sortBy)) return sortBy;
  return '_id';
}
