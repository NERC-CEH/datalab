import mockClient from './graphqlClient';
import internalNameCheckerSevice from './internalNameCheckerService';

jest.mock('./graphqlClient');

describe('internalNameCheckerService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('checkNameUniqueness', () => {
    it('should build the correct query and unpack the results', () => {
      const queryParams = { projectKey: 'testproj', name: 'validateName' };
      mockClient.prepareSuccess({ checkNameUniqueness: 'expectedValue' });

      return internalNameCheckerSevice.checkNameUniqueness(queryParams.projectKey, queryParams.name).then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(queryParams);
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return internalNameCheckerSevice.checkNameUniqueness('validateName').catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
