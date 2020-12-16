import Stacks from './Stacks';
import * as stackRepository from '../dataaccess/stacksRepository';
import stackManager from './stackManager';
import deploymentApi from '../kubernetes/deploymentApi';

jest.mock('./Stacks');
jest.mock('../dataaccess/stacksRepository');
jest.mock('../kubernetes/deploymentApi');

const getStackMock = jest.fn();
Stacks.getStack = getStackMock;

const createOrUpdateMock = jest.fn().mockReturnValue(Promise.resolve());
const deleteStackMock = jest.fn().mockReturnValue(Promise.resolve());
stackRepository.default = {
  createOrUpdate: createOrUpdateMock,
  deleteStack: deleteStackMock,
};

const StackResolve = {
  name: 'expectedStackName',
  category: 'ANALYSIS',
  create: vals => Promise.resolve(vals),
  delete: vals => Promise.resolve(vals),
};

const params = {
  datalabInfo: {
    domain: 'expectedDatalabDomain',
    name: 'expectedDatalabName',
  },
  projectKey: 'project',
  name: 'expectedName',
  type: 'jupyter',
  another: 'field',
};

const user = 'username';

describe('Stack Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStack', () => {
    it('calls Stack.create with correct parameters', () => {
      getStackMock.mockReturnValue(StackResolve);

      return stackManager.createStack(user, params)
        .then(response => expect(response).toMatchSnapshot());
    });

    it('calls stack repository with correct parameters', () => {
      getStackMock.mockReturnValue(StackResolve);

      return stackManager.createStack(user, params)
        .then(() => expect(createOrUpdateMock.mock.calls).toMatchSnapshot());
    });

    it('failed Stack.create requests are caught', () => {
      getStackMock.mockReturnValue(null);

      return stackManager.createStack(user, params)
        .catch(err => expect(err).toMatchSnapshot());
    });
  });

  describe('restartStack', () => {
    it('calls deploymentApi.restartDeployment with correct parameters', async () => {
      // Arrange
      getStackMock.mockReturnValue(StackResolve);
      const restartDeploymentMock = jest.fn().mockResolvedValue('success');
      deploymentApi.restartDeployment = restartDeploymentMock;

      // Act
      const response = await stackManager.restartStack(params);

      // Assert
      expect(restartDeploymentMock).toBeCalledWith('jupyter-expectedName', 'project');
      expect(response).toEqual('success');
    });
  });

  describe('deleteStack', () => {
    it('calls Stack.delete with correct parameters', () => {
      getStackMock.mockReturnValue(StackResolve);

      return stackManager.deleteStack(user, params)
        .then(response => expect(response).toMatchSnapshot());
    });

    it('calls stack repository with correct parameters', () => {
      getStackMock.mockReturnValue(StackResolve);

      return stackManager.deleteStack(user, params)
        .then(() => expect(deleteStackMock.mock.calls).toMatchSnapshot());
    });

    it('failed Stack.delete requests are caught', () => {
      getStackMock.mockReturnValue(null);

      return stackManager.deleteStack(user, params)
        .catch(err => expect(err).toMatchSnapshot());
    });
  });
});
