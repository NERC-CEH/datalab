import validate from 'validate.js';

const constraints = {
  name: {
    presence: true,
    length: { minimum: 2 },
  },
  description: {
    presence: false,
  },
  collaborationLink: {
    presence: false,
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

const syncValidate = values => validate(values, constraints, { format: 'reduxForm' });

export default syncValidate;
