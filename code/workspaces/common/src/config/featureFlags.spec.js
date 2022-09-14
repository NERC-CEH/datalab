import featureFlagsConfig from './featureFlags';

describe('featureFlagsConfig', () => {
  it('has expected content', () => {
    expect(featureFlagsConfig()).toMatchSnapshot();
  });
});
