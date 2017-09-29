import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import datalabRepository from '../dataaccess/datalabRepository';
import notebookRepository from '../dataaccess/notebookRepository';
import config from '../config';
import notebookApi from './notebookApi';

jest.mock('../dataaccess/datalabRepository');
jest.mock('../dataaccess/notebookRepository');

const mockGetDatalabByName = jest.fn();
datalabRepository.getByName = mockGetDatalabByName;

const mockCreateNotebook = jest.fn();
notebookRepository.createOrUpdate = mockCreateNotebook;

const NOTEBOOK_CREATION_URL = `${config.get('infrastructureApi')}/stacks`;

const httpMock = new MockAdapter(axios);
const datalabInfo = { name: 'testlab', domain: 'test-datalabs.nerc.ac.uk' };
const notebookName = 'notebookName';
const notebookType = 'jupyter';

describe('Notebook API', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('create notebook', () => {
    it('should store the notebook and send a create request', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockCreateNotebook.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(NOTEBOOK_CREATION_URL)
        .reply(201);

      const notebookRequest = { name: notebookName, type: notebookType };
      notebookApi.createNotebook(undefined, datalabInfo.name, notebookRequest)
        .then((notebook) => {
          expect(notebook).toMatchSnapshot();
        });
    });

    it('should handle api errors', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockCreateNotebook.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(NOTEBOOK_CREATION_URL)
        .reply(400);

      const notebookRequest = { name: notebookName, type: notebookType };
      notebookApi.createNotebook(undefined, datalabInfo.name, notebookRequest)
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });
  });
});
