import validate from 'validate.js';
import projectActions from '../../actions/projectActions';

const constraints = {
  name: {
    presence: true,
    length: { minimum: 2 },
  },
  projectKey: {
    presence: true,
    format: {
      pattern: '^[a-z]+$',
      message: 'can only contain lowercase letters',
    },
    length: {
      minimum: 2,
      maximum: 8,
    },
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

export const syncValidate = values => validate(values, constraints, { format: 'reduxForm' });

// Catch statement added to prevent submission of creation request without passing uniqueness check.
export const asyncValidate = (values, dispatch) => dispatch(projectActions.checkProjectKeyUniqueness(values.projectKey))
  .catch(() => Promise.reject({ name: 'Unable to check if Project Key is unique.' }))
  .then((response) => {
    if (!response.value) {
      return Promise.reject({ projectKey: 'Project Key already exists. It must be unique.' });
    }
    return Promise.resolve();
  });
