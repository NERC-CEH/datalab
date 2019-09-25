import { validationResult } from 'express-validator';
import prometheusMiddleware from 'express-prometheus-middleware';

const validator = (validations, logger) => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  logger.debug('Error validating request', errors.array());
  return res.status(400).json({ errors: errors.array() });
};

const metricsMiddleware = prometheusMiddleware({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
});

// Error wrapper function to allow controller functions to omit try/catch block
const errorWrapper = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createErrorHandler = logger => (error, request, response, next) => { // eslint-disable-line no-unused-vars
  const errorObject = {
    method: request.method,
    url: request.url,
    message: error.message,
  };

  logger.error(error);
  logger.error(errorObject);
  response.status(500);
  return response.send({ error: error.message });
};

export { metricsMiddleware, errorWrapper, validator, createErrorHandler };
