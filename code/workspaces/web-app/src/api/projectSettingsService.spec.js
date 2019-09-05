import mockClient from './graphqlClient';
import getProjectUsers from './projectSettingsService';

jest.mock('./graphqlClient');

describe('projectSettingsService', () => {
  beforeEach(() => {
    mockClient.clearResult();
  });

  it('getProjectUsers should build correct query and unpack the result', () => {
    mockClient.prepareSuccess({ project: { projectUsers: 'expectedValue' } });

    return getProjectUsers('project-id').then((response) => {
      expect(response).toEqual('expectedValue');
      expect(mockClient.lastQuery()).toMatchSnapshot();
    });
  });

  it('getProjectUsers should throw an error if the query fails', () => {
    mockClient.prepareFailure('error');

    return getProjectUsers('project-id').catch((error) => {
      expect(error).toEqual({ error: 'error' });
    });
  });
});
