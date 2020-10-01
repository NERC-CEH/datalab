import { validationResult } from 'express-validator';
import logger from '../config/logger';

function validateAndExecute(request, response, errorMessage, execute) {
  // Parse request for errors
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    logger.error(`${errorMessage}: ${JSON.stringify(request.body)}`);
    logger.error(JSON.stringify(errors.mapped()));
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

const sendSuccessfulRestart = response => () => {
  response.status(200);
  response.send({ message: 'OK' });
};

const handleError = (response, action, type, name) => (error) => {
  const message = name ? `Error ${action} ${type}: ${name}` : `Error ${action} ${type}`;
  logger.error(error);
  response.status(500);
  response.send({
    message,
    error: error.message,
  });
};

export default { validateAndExecute, sendSuccessfulCreation, sendSuccessfulDeletion, sendSuccessfulRestart, handleError };
