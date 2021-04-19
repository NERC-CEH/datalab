import validate from 'validate.js';
import { editConstraints } from './editRepoMetadataValidator';

const constraints = {
  ...editConstraints,
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
  fileLocation: {
    format: {
      pattern: /^(\/[^\/ ]*)+\/?$/, // eslint-disable-line no-useless-escape
      message: 'is invalid - it must start with a leading slash, trailing slash optional',
    },
  },
  masterUrl: {
    url: true,
  },
};

const fileLocationPresent = {
  fileLocation: {
    presence: true,
  },
};

const masterUrlPresent = {
  masterUrl: {
    presence: true,
  },
};

validate.formatters.reduxForm = errors => errors.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

const addRepoMetadataValidator = (values) => {
  const validation = validate(values, constraints, { format: 'reduxForm' });

  // perform extra validation - must have one of file location or master url
  const fileLocationPresentValidation = validate(values, fileLocationPresent, { format: 'reduxForm' });
  const masterUrlPresentValidation = validate(values, masterUrlPresent, { format: 'reduxForm' });
  const totalValidation = (fileLocationPresentValidation && masterUrlPresentValidation)
    ? {
      ...validation,
      fileLocation: 'Must be specified if Master URL is blank',
      masterUrl: 'Must be specified if File location is blank',
    } : validation;
  return totalValidation;
};

export default addRepoMetadataValidator;
