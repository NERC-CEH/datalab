import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import datalabRepository from '../dataaccess/datalabRepository';
import stackRepository from '../dataaccess/stackRepository';
import config from '../config';
import * as infApiGen from './infrastructureApiGenerators';

jest.mock('../dataaccess/datalabRepository');
jest.mock('../dataaccess/stackRepository');

const datalabInfo = {
  test: 'testlab',
  domain: 'test-datalabs.nerc.ac.uk',
};

const STACK_CREATION_URL = `${config.get('infrastructureApi')}/stacks`;

const mockGetDatalabByName = jest.fn();
datalabRepository.getByName = mockGetDatalabByName;
mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));

const mockCreateOrUpdate = jest.fn();
stackRepository.createOrUpdate = mockCreateOrUpdate;
mockCreateOrUpdate.mockReturnValue(Promise.resolve({}));

const mockGenerateApiRequest = jest.fn();

const mockGenerateApiPayload = jest.fn();

const httpMock = new MockAdapter(axios);

const infApiConfig = {
  apiRoute: 'stacks',
  elementName: 'stack',
  createOrUpdateRecord: mockCreateOrUpdate,
  deleteRecord: () => {},
  generateApiRequest: mockGenerateApiRequest,
  generateApiPayload: mockGenerateApiPayload,
};

describe('Infrastructure Api Generators', () => {
  beforeEach(() => {
    httpMock.reset();
    mockGenerateApiRequest.mockReset();
    mockGenerateApiPayload.mockReset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('create stack', () => {
    it('should call generate api request with correct arguments', () => {
      httpMock.onPost(STACK_CREATION_URL)
        .reply(201);

      const requestedStack = { name: 'testStack', type: 'jupyer' };

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(undefined, datalabInfo.name, requestedStack)
        .then(() => {
          expect(mockGenerateApiRequest).toHaveBeenCalledTimes(1);
          expect(mockGenerateApiRequest).toHaveBeenCalledWith(requestedStack, datalabInfo);
        });
    });

    it('should call generate api payload with correct arguments', () => {
      httpMock.onPost(STACK_CREATION_URL)
        .reply(201);

      const apiResponse = { expected: 'requestResponse' };
      mockGenerateApiRequest.mockReturnValue(apiResponse);

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(undefined, datalabInfo.name, { name: 'testStack', type: 'jupyer' })
        .then(() => {
          expect(mockGenerateApiPayload).toHaveBeenCalledTimes(1);
          expect(mockGenerateApiPayload).toBeCalledWith(apiResponse, datalabInfo);
        });
    });

    it('should send a create request', () => {
      httpMock.onPost(STACK_CREATION_URL)
        .reply(201);

      const requestedStack = { name: 'testStack', type: 'jupyer' };

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(undefined, datalabInfo.name, requestedStack)
        .then((output) => {
          expect(output).toEqual(requestedStack);
        });
    });

    it('should handle api errors', () => {
      httpMock.onPost(STACK_CREATION_URL)
        .reply(400);

      const createStack = infApiGen.generateCreateElement(infApiConfig);

      return createStack(undefined, datalabInfo.name, { name: 'testStack', type: 'jupyer' })
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });
  });

  describe('delete stack', () => {
    it('should call generate api payload with correct arguments', () => {
      httpMock.onDelete(STACK_CREATION_URL)
        .reply(201);

      const requestedStack = { name: 'testStack', type: 'jupyer' };

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(undefined, datalabInfo.name, requestedStack)
        .then(() => {
          expect(mockGenerateApiPayload).toHaveBeenCalledTimes(1);
          expect(mockGenerateApiPayload).toBeCalledWith(requestedStack, datalabInfo);
          expect(mockGenerateApiRequest).not.toHaveBeenCalled();
        });
    });

    it('should send a delete request', () => {
      httpMock.onDelete(STACK_CREATION_URL)
        .reply(201);

      const requestedStack = { name: 'testStack' };

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(undefined, datalabInfo.name, requestedStack)
        .then((output) => {
          expect(output).toEqual(requestedStack);
        });
    });

    it('should handle api errors', () => {
      httpMock.onDelete(STACK_CREATION_URL)
        .reply(201);

      const deleteStack = infApiGen.generateDeleteElement(infApiConfig);

      return deleteStack(undefined, datalabInfo.name, { name: 'testStack' })
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });
  });
});
