import logger from 'winston';
import stackApi from './stackApi';
import datalabRepository from '../dataaccess/datalabRepository';
import stackService from '../dataaccess/stackService';

jest.mock('winston');
jest.mock('../dataaccess/datalabRepository');
jest.mock('../dataaccess/stackService');

const datalabInfo = { name: 'testlab', domain: 'test-datalabs.ceh.ac.uk' };
const context = { token: 'expectedToken', user: 'expectedUser' };
const stack = { name: 'expectedName', type: 'expectedType' };

const getByNameMock = jest.fn().mockReturnValue(Promise.resolve(datalabInfo));
const createStackMock = jest.fn();
const deleteStackMock = jest.fn();

datalabRepository.getByName = getByNameMock;
stackService.createStack = createStackMock;
stackService.deleteStack = deleteStackMock;

describe('Stack API', () => {
  afterEach(() => {
    jest.clearAllMocks();
    logger.clearMessages();
  });

  it('should make correct API request for creation', () => {
    createStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    expect(getByNameMock).not.toHaveBeenCalled();
    expect(createStackMock).not.toHaveBeenCalled();

    return stackApi.createStack(context, 'expectedDatalabName', stack)
      .then((response) => {
        expect(getByNameMock).toHaveBeenCalledWith(context.user, 'expectedDatalabName');
        expect(createStackMock).toHaveBeenCalledWith(context, { ...stack, isPublic: true, datalabInfo });
        expect(response).toBe('expectedPayload');
      });
  });

  it('should log stack detail on successful creation request', () => {
    createStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.createStack(context, 'expectedDatalabName', stack)
      .then(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should log error detail on failed creation request', () => {
    createStackMock.mockReturnValue(Promise.reject('failedRequest'));

    return stackApi.createStack(context, 'expectedDatalabName', stack)
      .catch(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should make correct API request for deletion', () => {
    deleteStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    expect(getByNameMock).not.toHaveBeenCalled();
    expect(deleteStackMock).not.toHaveBeenCalled();

    return stackApi.deleteStack(context, 'expectedDatalabName', stack)
      .then((response) => {
        expect(getByNameMock).toHaveBeenCalledWith(context.user, 'expectedDatalabName');
        expect(deleteStackMock).toHaveBeenCalledWith(context, { ...stack, datalabInfo });
        expect(response).toBe('expectedPayload');
      });
  });

  it('should log stack detail on successful deletion request', () => {
    deleteStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    return stackApi.deleteStack(context, 'expectedDatalabName', stack)
      .then(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });

  it('should log error detail on failed deletion request', () => {
    deleteStackMock.mockReturnValue(Promise.resolve('expectedPayload'));

    getByNameMock.mockReturnValue(Promise.reject('failedRequest'));

    return stackApi.deleteStack(context, 'expectedDatalabName', stack)
      .catch(() => {
        expect(logger.getInfoMessages()).toMatchSnapshot();
        expect(logger.getDebugMessages()).toMatchSnapshot();
        expect(logger.getErrorMessages()).toMatchSnapshot();
      });
  });
});
