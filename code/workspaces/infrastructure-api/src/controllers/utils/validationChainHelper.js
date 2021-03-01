class ValidationChainHelper {
  constructor(validationChain) {
    this.validationChain = validationChain;
  }

  getValidationChain() {
    return this.validationChain;
  }

  exists() {
    this.validationChain
      .exists()
      .withMessage('A value must be specified.');
    return this;
  }

  optional(options) {
    this.validationChain
      .optional(options);
    return this;
  }

  isArray() {
    this.validationChain
      .isArray()
      .withMessage('Value must be an array.');
    return this;
  }

  isIn(values) {
    this.validationChain
      .isIn(values)
      .withMessage(`Value must be one of: ${values.join(', ')}.`);
    return this;
  }

  isUrl(options) {
    this.validationChain
      .isURL(options)
      .withMessage('Value must be formatted as a URL.');
    return this;
  }

  isUUIDv4() {
    this.validationChain
      .isUUID(4)
      .withMessage('Value must be formatted as a v4 UUID.');
    return this;
  }

  notEmpty() {
    this.validationChain
      .isLength({ min: 1 })
      .withMessage('Value cannot be empty.');
    return this;
  }
}

export default ValidationChainHelper;
