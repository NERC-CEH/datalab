import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { initialiseFeatureFlags, getFeatureFlags } from './featureFlags';

const httpMock = new MockAdapter(axios);
httpMock.onGet('/feature_flags_config.json').reply(() => [200, { requestProjects: true }]);

describe('featureFlags', () => {
  it('returns correct configuration', async () => {
    await initialiseFeatureFlags();
    const featureFlags = getFeatureFlags();
    expect(featureFlags).toEqual({ requestProjects: true });
  });
});
