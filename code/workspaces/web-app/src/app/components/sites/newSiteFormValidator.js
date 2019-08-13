import validate from 'validate.js';
import { stackTypes } from 'common';
import internalNameCheckerActions from '../../actions/internalNameCheckerActions';

const { getStackKeys } = stackTypes;

const constraints = {
  displayName: {
    presence: true,
  },
  type: {
    presence: true,
    inclusion: getStackKeys(),
  },
  name: {
    presence: true,
    format: {
      pattern: '^[a-z]*$',
      message: 'must be lower case characters without a space',
    },
    length: {
      minimum: 4,
      maximum: 12,
    },
  },
  description: {
    presence: true,
  },
  sourcePath: {
    presence: true,
  },
  volumeMount: {
    presence: {
      allowEmpty: false,
    },
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

export const syncValidate = values => validate(values, constraints, { format: 'reduxForm' });

// Catch statement added to prevent submission of creation request without passing uniqueness check.
export const asyncValidate = (values, dispatch) => dispatch(internalNameCheckerActions.checkNameUniqueness(values.name))
  .catch(() => Promise.reject({ name: 'Unable to check if Data Store Name is unique.' }))
  .then((response) => {
    if (!response.value) {
      return Promise.reject({ name: 'Site already exists. Name must be unique' });
    }
    return Promise.resolve();
  });
