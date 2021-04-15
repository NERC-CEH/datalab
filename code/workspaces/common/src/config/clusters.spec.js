import clustersConfig from './clusters';

describe('clustersConfig', () => {
  it('has expected content', () => {
    expect(clustersConfig()).toMatchSnapshot();
  });
});
