import assetRepoSelectors from './assetRepoSelectors';

const state = {
  assetRepo: {
    fetching: false,
    error: null,
    value: 'asset-1234',
  },
};

describe('assetRepo', () => {
  it('returns value of assetRepo from state', () => {
    const assetRepo = assetRepoSelectors.assetRepo(state);
    expect(assetRepo).toEqual(state.assetRepo);
    expect(assetRepo).not.toBeUndefined();
  });
});
