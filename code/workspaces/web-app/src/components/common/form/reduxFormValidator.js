import validate from 'validate.js';

const FORMATTER_NAME = 'reduxForm';

validate.formatters[FORMATTER_NAME] = errors => errors.reduce(
  (formatted, error) => ({ ...formatted, [error.attribute]: error.error }),
  {},
);

const reduxFormValidator = (values, constraints) => validate(values, constraints, { format: FORMATTER_NAME });
export default reduxFormValidator;
