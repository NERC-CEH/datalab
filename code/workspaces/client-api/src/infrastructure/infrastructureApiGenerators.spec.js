import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import datalabRepository from '../dataaccess/datalabRepository';
import stackService from '../dataaccess/stackService';
import config from '../config';
import * as infApiGen from './infrastructureApiGenerators';

jest.mock('../dataaccess/datalabRepository');
jest.mock('../dataaccess/stackService');

const authContext = {
  user: 'expectedUser',
  token: 'tokenToken',
};

const datalabInfo = {
  test: 'testlab',
  domain: 'test-datalabs.nerc.ac.uk',
};

const STACK_URL = `${config.get('infrastructureApi')}/stacks`;

const mockGetDatalabByName = jest.fn();
datalabRepository.getByName = mockGetDatalabByName;
mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));

const mockCreateOrUpdate = jest.fn();
stackService.createOrUpdate = mockCreateOrUpdate;
mockCreateOrUpdate.mockReturnValue(Promise.resolve({}));

const mockDeleteRecord = jest.fn();

const mockGenerateApiRequest = jest.fn();

const mockGenerateApiPayload = jest.fn();

const httpMock = new MockAdapter(axios);

const infApiConfig = {
  apiRoute: 'stacks',
  elementName: 'stack',
  createOrUpdateRecord: mockCreateOrUpdate,
  deleteRecord: mockDeleteRecord,
  generateApiRequest: mockGenerateApiRequest,
  generateApiPayload: mockGenerateApiPayload,
};

describe('Infrastructure Api Generators', () => {
  beforeEach(() => {
    httpMock.reset();
    mockGenerateApiRequest.mockReset();
    mockGenerateApiPayload.mockReset();
    mockGetDatalabByName.mockClear();
    mockCreateOrUpdate.mockClear();
    mockDeleteRecord.mockClear();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('create stack', () => {
    it('should call generate api request with correct arguments', () => {
      httpMock.onPost(STACK_URL)
        .reply(201);

      const requestedStack = { name: 'testStack', type: 'jupyer' };

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(authContext, 'expectedDatalab', requestedStack)
        .then(() => {
          expect(mockGenerateApiRequest).toHaveBeenCalledTimes(1);
          expect(mockGenerateApiRequest).toHaveBeenCalledWith(requestedStack, datalabInfo);
        });
    });

    it('should call generate api payload with correct arguments', () => {
      httpMock.onPost(STACK_URL)
        .reply(201);

      const apiResponse = { expected: 'requestResponse' };
      mockGenerateApiRequest.mockReturnValue(apiResponse);

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(authContext, 'expectedDatalab', { name: 'testStack', type: 'jupyer' })
        .then(() => {
          expect(mockGenerateApiPayload).toHaveBeenCalledTimes(1);
          expect(mockGenerateApiPayload).toBeCalledWith(apiResponse, datalabInfo);
        });
    });

    it('should send a create request', () => {
      httpMock.onPost(STACK_URL)
        .reply(201);

      const requestedStack = { name: 'testStack', type: 'jupyer' };

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(authContext, 'expectedDatalab', requestedStack)
        .then((output) => {
          expect(output).toEqual(requestedStack);
        });
    });

    it('should handle api errors', () => {
      httpMock.onPost(STACK_URL)
        .reply(400);

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(authContext, 'expectedDatalab', { name: 'testStack', type: 'jupyer' })
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });

    it('should call getByName with correct values', () => {
      httpMock.onPost(STACK_URL)
        .reply(201);

      const datalabName = 'expectedDatalab';

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(authContext, datalabName, { name: 'testStack', type: 'jupyer' })
        .then(() => {
          expect(mockGetDatalabByName).toHaveBeenCalledTimes(1);
          expect(mockGetDatalabByName).toBeCalledWith(authContext.user, datalabName);
        });
    });

    it('should call createOrUpdateRecord with correct values', () => {
      httpMock.onPost(STACK_URL)
        .reply(201);

      const apiResponse = { expected: 'requestResponse' };
      mockGenerateApiRequest.mockReturnValue(apiResponse);

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(authContext, 'expectedDatalab', { name: 'testStack', type: 'jupyer' })
        .then(() => {
          expect(mockCreateOrUpdate).toHaveBeenCalledTimes(1);
          expect(mockCreateOrUpdate).toBeCalledWith(authContext.user, apiResponse);
        });
    });
  });

  describe('delete stack', () => {
    it('should call generate api payload with correct arguments', () => {
      httpMock.onDelete(STACK_URL)
        .reply(201);

      const requestedStack = { name: 'testStack', type: 'jupyer' };

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(authContext, 'expectedDatalab', requestedStack)
        .then(() => {
          expect(mockGenerateApiPayload).toHaveBeenCalledTimes(1);
          expect(mockGenerateApiPayload).toBeCalledWith(requestedStack, datalabInfo);
          expect(mockGenerateApiRequest).not.toHaveBeenCalled();
        });
    });

    it('should send a delete request', () => {
      httpMock.onDelete(STACK_URL)
        .reply(201);

      const requestedStack = { name: 'testStack' };

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(authContext, 'expectedDatalab', requestedStack)
        .then((output) => {
          expect(output).toEqual(requestedStack);
        });
    });

    it('should handle api errors', () => {
      httpMock.onDelete(STACK_URL)
        .reply(201);

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(authContext, 'expectedDatalab', { name: 'testStack' })
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });

    it('should call getByName with correct values', () => {
      httpMock.onDelete(STACK_URL)
        .reply(201);

      const datalabName = 'expectedDatalab';

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(authContext, datalabName, { name: 'testStack' })
        .then(() => {
          expect(mockGetDatalabByName).toHaveBeenCalledTimes(1);
          expect(mockGetDatalabByName).toBeCalledWith(authContext.user, datalabName);
        });
    });

    it('should call createOrUpdateRecord with correct values', () => {
      httpMock.onDelete(STACK_URL)
        .reply(201);

      const requestedStack = { name: 'testStack' };

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(authContext, 'expectedDatalab', requestedStack)
        .then(() => {
          expect(mockDeleteRecord).toHaveBeenCalledTimes(1);
          expect(mockDeleteRecord).toBeCalledWith(authContext.user, requestedStack);
        });
    });
  });
});
