import usersService from '../dataaccess/usersService';

const convertIdsToNames = async (obj, token) => {
  // Converts all IDs in a "users" array to user names.
  if (!obj.users) {
    return obj;
  }

  const names = await Promise.all(obj.users.map(u => usersService.getUserName(u, token)));

  return {
    ...obj,
    users: names,
  };
};

const replaceFields = async (fn, token) => {
  // Replaces certain fields in the response object from "fn", namely converting user IDs to user names.
  const response = await fn;

  if (Array.isArray(response)) {
    return Promise.all(response.map(async i => convertIdsToNames(i, token)));
  }

  return convertIdsToNames(response, token);
};

export { convertIdsToNames, replaceFields };
