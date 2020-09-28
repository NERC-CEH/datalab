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

describe('searchUrl', () => {
  it('selects the router location hash from state', () => {
    expect(routerSelectors.searchUrl(state)).toEqual(state.router.location.search);
  });
});
