import validate from 'validate.js';

const constraints = {
  name: {
    presence: true,
    length: { minimum: 4 },
  },
  version: {
    presence: true,
  },
  type: {
    presence: true,
  },
  filePath: {
    format: /^(\/[^\/ ]*)+\/?$/, // eslint-disable-line no-useless-escape
  },
  masterUrl: {
    url: true,
  },
  owners: {
    presence: { allowEmpty: false },
  },
  visible: {
    presence: true,
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

const addRepoMetadataValidator = values => validate(values, constraints, { format: 'reduxForm' });

export default addRepoMetadataValidator;
