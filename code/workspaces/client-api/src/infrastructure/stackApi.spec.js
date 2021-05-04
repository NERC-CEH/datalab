import logger from 'winston';
import stackApi from './stackApi';
import stackService from '../dataaccess/stackService';

jest.mock('winston');
jest.mock('../dataaccess/stackService');

const context = { token: 'expectedToken', user: 'expectedUser' };
const stack = { name: 'expectedName', type: 'expectedType', projectKey: 'project' };

const createStackMock = jest.fn();
const deleteStackMock = jest.fn();
const updateStackMock = jest.fn();
const restartStackMock = jest.fn();

stackService.createStack = createStackMock;
stackService.deleteStack = deleteStackMock;
stackService.updateStack = updateStackMock;
stackService.restartStack = restartStackMock;

describe('Stack API', () => {
  afterEach(() => {
    jest.clearAllMocks();
    logger.clearMessages();
  });

  it('should make correct API request for creation', () => {
    createStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    expect(createStackMock).not.toHaveBeenCalled();

    return stackApi.createStack(context, stack)
      .then((response) => {
        expect(createStackMock).toHaveBeenCalledWith(stack.projectKey, { ...stack, isPublic: true }, context);
        expect(response).toBe('expectedPayload');
      });
  });

  it('should log stack detail on successful creation request', () => {
    createStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.createStack(context, stack)
      .then(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should log error detail on failed creation request', () => {
    createStackMock.mockReturnValue(Promise.reject(new Error('failedRequest')));

    return stackApi.createStack(context, stack)
      .catch(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should make correct API request for deletion', () => {
    deleteStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    expect(deleteStackMock).not.toHaveBeenCalled();

    return stackApi.deleteStack(context, stack)
      .then((response) => {
        expect(deleteStackMock).toHaveBeenCalledWith(stack.projectKey, { ...stack }, context);
        expect(response).toBe('expectedPayload');
      });
  });

  it('should log stack detail on successful deletion request', () => {
    deleteStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.deleteStack(context, stack)
      .then(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should log error detail on failed deletion request', () => {
    deleteStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.deleteStack(context, stack)
      .catch(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should make correct API request for update', () => {
    updateStackMock.mockReturnValue(Promise.resolve('expectedPayload'));
    expect(updateStackMock).not.toHaveBeenCalled();

    return stackApi.updateStack(context, stack)
      .then((response) => {
        expect(updateStackMock).toHaveBeenCalledWith(stack.projectKey, { ...stack, isPublic: true }, context);
        expect(response).toBe('expectedPayload');
      });
  });

  it('should log action on successful update request', () => {
    updateStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.updateStack(context, stack)
      .then(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should log error detail on failed update request', () => {
    updateStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.updateStack(context, stack)
      .catch(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should make correct API request for restart', async () => {
    restartStackMock.mockResolvedValue('expectedPayload');
    expect(restartStackMock).not.toHaveBeenCalled();

    const response = await stackApi.restartStack(context, stack);

    expect(restartStackMock).toHaveBeenCalledWith(stack.projectKey, { ...stack }, context);
    expect(response).toBe('expectedPayload');
  });

  it('should log action on successful restart request', async () => {
    restartStackMock.mockResolvedValue('expectedPayload');
    await stackApi.restartStack(context, stack);
    expect(logger.getInfoMessages()).toMatchSnapshot();
    expect(logger.getDebugMessages()).toMatchSnapshot();
    expect(logger.getErrorMessages()).toMatchSnapshot();
  });

  it('should log error detail on failed restart request', async () => {
    restartStackMock.mockReturnValue(Promise.reject(new Error('failedRequest')));

    try {
      await stackApi.restartStack(context, stack);
      // should not hit this line as error should be thrown
      expect(true).toBeFalsy();
    } catch (error) {
      expect(logger.getInfoMessages()).toMatchSnapshot();
      expect(logger.getDebugMessages()).toMatchSnapshot();
      expect(logger.getErrorMessages()).toMatchSnapshot();
    }
  });
});
