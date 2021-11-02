import validate from 'validate.js';

const constraints = props => ({
  project: {
    presence: {
      allowEmpty: false,
    },
    inclusion: props.projectOptions.map(o => o.value),
  },
  notebook: {
    presence: {
      allowEmpty: false,
    },
    inclusion: props.notebookOptions.map(o => o.value),
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

const syncValidate = (values, props) => validate(values, constraints(props), { format: 'reduxForm' });

export default syncValidate;
