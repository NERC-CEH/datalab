const constraints = {
  displayName: {
    presence: true,
  },
  type: {
    presence: true,
  },
  volumeSize: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 5,
      lessThanOrEqualTo: 200,
    },
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
  description: {
    presence: true,
  },
  users: {
    presence: { allowEmpty: false },
  },
};

export default constraints;
