import reduxFormValidator from '../common/form/reduxFormValidator';

const constraints = {
  displayName: {
    presence: true,
    length: { minimum: 2 },
  },
  name: {
    presence: true,
    format: {
      pattern: '^[a-z0-9]+$',
      message: 'must be lower case characters without a space',
    },
    length: {
      minimum: 4,
      maximum: 16,
    },
  },
  volumeMount: {
    presence: true,
  },
  maxWorkers: {
    presence: true,
    numericality: { onlyInteger: true, noStrings: true },
  },
  maxWorkerMemoryGb: {
    presence: true,
    numericality: { noStrings: true },
  },
  maxWorkerCpu: {
    presence: true,
    numericality: { noStrings: true },
  },
};

// eslint-disable-next-line import/prefer-default-export
export const syncValidate = values => reduxFormValidator(values, constraints);
