import { nameValidator, projectKeyValidator, optionalProjectKeyValidator } from './commonValidators';
import ValidationChainHelper from './ValidationChainHelper';

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  isName: mockHelperChainMethod(),
  optional: mockHelperChainMethod(),
  notEmpty: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('commonValidators', () => {
  let paramMock;

  beforeEach(() => {
    jest.clearAllMocks();
    paramMock = jest.fn(() => mockHelperChain);
  });

  describe('calls helper methods with correct argument on internal validation chain', () => {
    it('nameValidator', () => {
      nameValidator(paramMock);
      expect(paramMock).toHaveBeenCalledWith('name');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.isName).toHaveBeenCalledWith();
    });
    it('projectKeyValidator', () => {
      projectKeyValidator(paramMock);
      expect(paramMock).toHaveBeenCalledWith('projectKey');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
    it('optionalProjectKeyValidator', () => {
      optionalProjectKeyValidator(paramMock);
      expect(paramMock).toHaveBeenCalledWith('projectKey');
      expect(mockHelperChain.optional).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
  });
});
