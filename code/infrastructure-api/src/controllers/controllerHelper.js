import logger from 'winston';
import { validationResult } from 'express-validator/check';

function validateAndExecute(request, response, errorMessage, execute) {
  // Parse request for errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error(`${errorMessage}: ${JSON.stringify(request.body)}`);
    return response.status(400).json({ errors: errors.mapped() });
  }

  return execute(request, response);
}

const sendSuccessfulCreation = response => () => {
  response.status(201);
  response.send({ message: 'OK' });
};

const sendSuccessfulDeletion = response => () => {
  response.status(204);
  response.send({ message: 'OK' });
};

const handleError = (response, action, type, name) => (error) => {
  logger.error(error);
  response.status(500);
  response.send({
    message: `Error ${action} ${type}: ${name}`,
    error: error.message });
};

export default { validateAndExecute, sendSuccessfulCreation, sendSuccessfulDeletion, handleError };
