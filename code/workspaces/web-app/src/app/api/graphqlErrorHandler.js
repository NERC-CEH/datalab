import { get, isArray } from 'lodash';

function errorHandler(pathToData, ignoreError) {
  return (response) => {
    let { errors } = response;

    if (errors) {
      if (ignoreError) {
        errors = errors.filter(({ path }) =>
          isArray(path) && path.pop() !== ignoreError);
      }

      const firstError = errors[0];

      if (firstError) {
        throw new Error(firstError.message || firstError);
      }
    }

    return get(response, pathToData);
  };
}

export default errorHandler;
