import { get } from 'lodash';

function errorHandler(pathToData) {
  return (response) => {
    const { errors } = response;
    if (errors) {
      const firstError = errors[0];

      throw new Error(firstError.message || firstError);
    }

    return get(response, pathToData);
  };
}

export default errorHandler;
