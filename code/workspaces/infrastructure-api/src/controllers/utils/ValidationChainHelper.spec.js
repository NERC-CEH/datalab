import ValidationChainHelper from './validationChainHelper';

const mockValidationChainMethod = () => jest.fn().mockImplementation(() => mockValidationChain);

const mockValidationChain = {
  exists: mockValidationChainMethod(),
  isAlphanumeric: mockValidationChainMethod(),
  isArray: mockValidationChainMethod(),
  isFloat: mockValidationChainMethod(),
  isIn: mockValidationChainMethod(),
  isInt: mockValidationChainMethod(),
  isLength: mockValidationChainMethod(),
  isLowercase: mockValidationChainMethod(),
  isURL: mockValidationChainMethod(),
  isUUID: mockValidationChainMethod(),
  optional: mockValidationChainMethod(),
  trim: mockValidationChainMethod(),
  withMessage: mockValidationChainMethod(),
};

describe('ValidationChainHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getValidationChain', () => {
    it('returns internally stored validation chain object', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      expect(helper.getValidationChain()).toBe(mockValidationChain);
    });
  });

  describe('exists', () => {
    it('calls exists and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.exists();
      expect(mockValidationChain.exists).toHaveBeenCalledWith();
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('A value must be specified.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.exists();
      expect(returnValue).toBe(helper);
    });
  });

  describe('isArray', () => {
    it('calls isArray and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.isArray();
      expect(mockValidationChain.isArray).toHaveBeenCalledWith();
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value must be an array.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isArray();
      expect(returnValue).toBe(helper);
    });
  });

  describe('isIn', () => {
    const possibleValues = ['value-one', 'value-two'];
    it('calls isIn with provided values and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.isIn(possibleValues);
      expect(mockValidationChain.isIn).toHaveBeenCalledWith(possibleValues);
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value must be one of: value-one, value-two.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isIn(possibleValues);
      expect(returnValue).toBe(helper);
    });
  });

  describe('isInFloatRange', () => {
    const min = 2.5;
    const max = 4.5;
    it('calls isFloat with provided values and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.isInFloatRange({ min, max });
      expect(mockValidationChain.isFloat).toHaveBeenCalledWith({ min, max });
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value must be a float in the range 2.5 to 4.5.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isInFloatRange({ min, max });
      expect(returnValue).toBe(helper);
    });
  });

  describe('isInIntRange', () => {
    const min = 2;
    const max = 4;
    it('calls isInt with provided values and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.isInIntRange({ min, max });
      expect(mockValidationChain.isInt).toHaveBeenCalledWith({ min, max });
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value must be an integer in the range 2 to 4.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isInIntRange({ min, max });
      expect(returnValue).toBe(helper);
    });
  });

  describe('isName', () => {
    it('calls isName with provided values and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.isName();
      expect(mockValidationChain.isLowercase).toHaveBeenCalledWith();
      expect(mockValidationChain.isAlphanumeric).toHaveBeenCalledWith();
      expect(mockValidationChain.isLength).toHaveBeenCalledWith({ min: 4, max: 16 });
      expect(mockValidationChain.withMessage).toHaveBeenNthCalledWith(1, 'Name must only use the characters a-z, 0-9');
      expect(mockValidationChain.withMessage).toHaveBeenNthCalledWith(2, 'Name must be 4-16 characters long');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isName();
      expect(returnValue).toBe(helper);
    });
  });

  describe('isUrl', () => {
    it('calls isURL with provided argument and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const options = { };
      helper.isUrl(options);
      expect(mockValidationChain.isURL).toHaveBeenCalledWith(options);
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value must be formatted as a URL.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isUrl();
      expect(returnValue).toBe(helper);
    });
  });

  describe('isUUIDv4', () => {
    it('calls isUUID with correct argument and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.isUUIDv4();
      expect(mockValidationChain.isUUID).toHaveBeenCalledWith(4);
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value must be formatted as a v4 UUID.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.isUUIDv4();
      expect(returnValue).toBe(helper);
    });
  });

  describe('notEmpty', () => {
    it('calls isLength with correct argument and withMessage with correct argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      helper.notEmpty();
      expect(mockValidationChain.trim).toHaveBeenCalledWith();
      expect(mockValidationChain.isLength).toHaveBeenCalledWith({ min: 1 });
      expect(mockValidationChain.withMessage).toHaveBeenCalledWith('Value cannot be empty.');
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.notEmpty();
      expect(returnValue).toBe(helper);
    });
  });

  describe('optional', () => {
    it('calls optional with provided argument on internal validation chain', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const options = { };
      helper.optional(options);
      expect(mockValidationChain.optional).toHaveBeenCalledWith(options);
    });

    it('returns itself to allow for chaining', () => {
      const helper = new ValidationChainHelper(mockValidationChain);
      const returnValue = helper.optional();
      expect(returnValue).toBe(helper);
    });
  });
});
