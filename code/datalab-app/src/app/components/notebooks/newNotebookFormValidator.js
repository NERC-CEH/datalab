import validate from 'validate.js';

const constraints = {
  displayName: {
    presence: true,
  },
  type: {
    presence: true,
    inclusion: ['jupyter', 'zeppelin'],
  },
  name: {
    presence: true,
    length: {
      minimum: 4,
      maximum: 12,
    },
  },
  description: {
    presence: true,
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

const validateObject = values => validate(values, constraints, { format: 'reduxForm' });

export default validateObject;
