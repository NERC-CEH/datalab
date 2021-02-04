// TODO - add unit tests
import validate from 'validate.js';

export const editConstraints = {
  displayName: {
    presence: true,
  },
  type: {
    presence: true,
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

export const syncValidate = values => validate(values, editConstraints, { format: 'reduxForm' });

