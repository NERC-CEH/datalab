import mockClient from './graphqlClient';
import assetRepoService from './assetRepoService';

jest.mock('./graphqlClient');

describe('assetRepoService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('addRepoMetadata', () => {
    it('should build the correct mutation and unpack the results', () => {
      const metadata = { name: 'expectedName' };
      const responseData = { createCentralAssetMetadata: { assetId: 'asset-1' } };
      mockClient.prepareSuccess(responseData);

      return assetRepoService.addRepoMetadata(metadata).then((response) => {
        expect(response).toEqual(responseData.createCentralAssetMetadata.assetId);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual({ metadata });
      });
    });

    it('should throw an error if the mutation fails', () => {
      mockClient.prepareFailure('error');

      return assetRepoService.addRepoMetadata({ metadata: 'metadata' }).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('loadVisibleAssets', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ centralAssetsAvailableToProject: 'expectedValue' });

      return assetRepoService.loadVisibleAssets().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return assetRepoService.loadVisibleAssets().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('loadAllAssets', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ centralAssets: 'expectedValue' });

      return assetRepoService.loadAllAssets().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return assetRepoService.loadAllAssets().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
