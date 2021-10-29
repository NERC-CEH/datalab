import validate from 'validate.js';

const constraints = () => ({
  project: {
    presence: {
      allowEmpty: false,
    },
  },
  notebook: {
    presence: {
      allowEmpty: false,
    },
  },
  assets: {
    presence: {
      allowEmpty: false,
    },
    type: 'array',
  },
});

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

const syncValidate = values => validate(values, constraints(), { format: 'reduxForm' });

export default syncValidate;
