import ValidationChainHelper from './ValidationChainHelper';
import { clusterTypeValidator, mountValidator } from './clusterValidators';

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  isIn: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('clusterValidators', () => {
  let bodyMock;

  beforeEach(() => {
    bodyMock = jest.fn(() => mockHelperChain);
  });

  describe('calls helper methods with correct argument on internal validation chain', () => {
    it('clusterTypeValidator', () => {
      clusterTypeValidator(bodyMock);
      expect(bodyMock).toHaveBeenCalledWith('type');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.isIn).toHaveBeenCalledWith(['DASK', 'SPARK']);
    });

    it('mountValidator', () => {
      mountValidator(bodyMock);
      expect(bodyMock).toHaveBeenCalledWith('volumeMount');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
    });
  });
});
