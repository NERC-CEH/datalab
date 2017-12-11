import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import datalabRepository from '../dataaccess/datalabRepository';
import stackRepository from '../dataaccess/stackRepository';
import config from '../config';
import stackApi from './stackApi';

jest.mock('../dataaccess/datalabRepository');
jest.mock('../dataaccess/stackRepository');

const mockGetDatalabByName = jest.fn();
datalabRepository.getByName = mockGetDatalabByName;

const mockCreateStack = jest.fn();
stackRepository.createOrUpdate = mockCreateStack;

const mockDeleteStack = jest.fn();
stackRepository.deleteByName = mockDeleteStack;

const STACK_CREATION_URL = `${config.get('infrastructureApi')}/stacks`;

const httpMock = new MockAdapter(axios);
const datalabInfo = { name: 'testlab', domain: 'test-datalabs.nerc.ac.uk' };
const stackName = 'notebookName';
const stackType = 'jupyter';

describe('Stack API', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('create stack', () => {
    it('should store the stack and send a create request', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockCreateStack.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(STACK_CREATION_URL)
        .reply(201);

      const stackRequest = { name: stackName, type: stackType };
      stackApi.createStack(undefined, datalabInfo.name, stackRequest)
        .then((notebook) => {
          expect(notebook).toMatchSnapshot();
        });
    });

    it('should handle creation api errors', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockCreateStack.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(STACK_CREATION_URL)
        .reply(400);

      const stackRequest = { name: stackName, type: stackType };
      stackApi.createStack(undefined, datalabInfo.name, stackRequest)
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });
  });

  it('should send a deletion request and remove data store record', () => {
    mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
    mockDeleteStack.mockReturnValue(Promise.resolve({}));

    httpMock.onDelete(STACK_CREATION_URL)
      .reply(201);

    const stackRequest = { name: stackName };
    stackApi.deleteStack(undefined, datalabInfo, stackRequest)
      .then((notebook) => {
        expect(notebook).toMatchSnapshot();
      });
  });

  it('should handle deletion api errors', () => {
    mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
    mockDeleteStack.mockReturnValue(Promise.resolve({}));

    httpMock.onPost(STACK_CREATION_URL)
      .reply(400);

    const stackRequest = { name: stackName, type: stackType };
    stackApi.deleteStack(undefined, datalabInfo, stackRequest)
      .catch((error) => {
        expect(error).toMatchSnapshot();
      });
  });
});
