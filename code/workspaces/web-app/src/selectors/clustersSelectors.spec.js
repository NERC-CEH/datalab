import clustersSelectors from './clustersSelectors';

describe('clusters', () => {
  it('returns the clusters portion of state', () => {
    const state = {
      clusters: { fetching: false, value: [], error: null },
      other: 'other section of state',
    };

    const returnValue = clustersSelectors.clusters(state);

    expect(returnValue).toEqual(state.clusters);
  });
});
