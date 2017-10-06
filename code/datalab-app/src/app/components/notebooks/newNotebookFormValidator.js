import validate from 'validate.js';
import notebookActions from '../../actions/notebookActions';

const constraints = {
  displayName: {
    presence: true,
  },
  type: {
    presence: true,
    inclusion: ['jupyter', 'zeppelin', 'rstudio'],
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
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

export const syncValidate = values => validate(values, constraints, { format: 'reduxForm' });

export const asyncValidate = (values, dispatch) =>
  dispatch(notebookActions.checkNotebookName(values.name))
    .then((response) => {
      if (response.value) {
        return Promise.reject({ name: 'Notebook already exists. Name must be unique' });
      }
      return Promise.resolve();
    });
