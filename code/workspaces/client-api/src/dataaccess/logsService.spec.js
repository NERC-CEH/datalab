import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import logger from 'winston';
import logsService from './logsService';

const mock = new MockAdapter(axios);
jest.mock('winston');

const httpMock = new MockAdapter(axios);
const projectKey = 'projectKey';
const context = { token: 'token' };

const logs = {
  data: {
    logs: 'Example Logs',
  },
};

beforeEach(() => {
  mock.reset();
});

afterEach(() => {
  logger.clearMessages();
});

afterAll(() => {
  mock.restore();
});

describe('logsService', () => {
  it('getLogs makes an api request', () => {
    httpMock.onGet(`http://localhost:8003/logs/${projectKey}/rshiny`)
      .reply(200, logs);

    return logsService.getLogsByName(projectKey, 'rshiny', context)
      .then(response => expect(response).toEqual(logs));
  });
});
