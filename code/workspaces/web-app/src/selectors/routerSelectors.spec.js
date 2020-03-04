import routerSelectors from './routerSelectors';

const state = {
  router: {
    location: {
      pathname: '/path/to/current/page',
      search: '?code=test',
      hash: 'hash-value',
      key: 'key-value',
    },
  },
};

describe('urlHash', () => {
  it('selects the router location hash from state', () => {
    expect(routerSelectors.urlHash(state)).toEqual(state.router.location.search);
  });
});
