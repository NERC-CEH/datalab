import mockClient from './graphqlClient';
import rolesService from './rolesService';

jest.mock('./graphqlClient');

describe('rolesService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('getAllUsersAndRoles', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ allUsersAndRoles: 'expectedValue' });

      return rolesService.getAllUsersAndRoles().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return rolesService.getAllUsersAndRoles().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('setInstanceAdmin', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ setInstanceAdmin: 'expectedValue' });

      return rolesService.setInstanceAdmin('one', true).then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return rolesService.setInstanceAdmin('one', true).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('setDataManager', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ setDataManager: 'expectedValue' });

      return rolesService.setDataManager('one', true).then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return rolesService.setDataManager('one', true).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('setCatalogueRole', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ setCatalogueRole: 'expectedValue' });

      return rolesService.setCatalogueRole('one', 'publisher').then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return rolesService.setCatalogueRole('one', 'publisher').catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
