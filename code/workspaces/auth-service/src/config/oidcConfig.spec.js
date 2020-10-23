import axios from 'axios';
import getOidcConfig from './oidcConfig';

jest.mock('axios');

describe('getOidcConfig', () => {
  const testConfiguration = {
    issuer: 'expectedIssuer',
    token_endpoint: 'expectedTokenEndpoint',
    jwks_uri: 'expectedJwksUri',
  };

  const noCachedValueOptions = {
    cacheValue: false,
    getCachedValue: false,
  };

  beforeEach(() => {
    axios.get.mockReset();
  });

  describe('returns config from configuration endpoint', () => {
    it('when all calls successful', async () => {
      axios.get.mockResolvedValue({ data: testConfiguration });
      const configuration = await getOidcConfig(noCachedValueOptions);
      expect(configuration).toEqual(testConfiguration);
    });

    it('when one of the calls fails', async () => {
      axios.get.mockResolvedValueOnce({ data: testConfiguration });
      axios.get.mockRejectedValueOnce(new Error('Expected promise rejection'));
      const configuration = await getOidcConfig(noCachedValueOptions);
      expect(configuration).toEqual(testConfiguration);
    });
  });

  it('returns config from environment to match snapshot when configuration endpoint requests fail', async () => {
    axios.get.mockRejectedValue(new Error('Expected promise rejection'));
    const configuration = await getOidcConfig(noCachedValueOptions);
    expect(configuration).toMatchSnapshot();
  });

  it('returns cached value when configured to do so', async () => {
    // ensure there is a cached value available of a successful call
    axios.get.mockResolvedValue({ data: testConfiguration });
    await getOidcConfig({ cacheValue: true });
    expect(axios.get).toBeCalled();

    // clear usage information so it can be checked later
    axios.get.mockClear();

    // check cached value returned
    const configuration = await getOidcConfig({ getCachedValue: true });
    expect(axios.get).not.toBeCalled();
    expect(configuration).toEqual(testConfiguration);
  });

  it('does not return cached value when configured not to do so', async () => {
    // ensure there is a cached value available of a successful call
    axios.get.mockResolvedValue({ data: testConfiguration });
    await getOidcConfig({ cacheValue: true });

    const alternativeConfiguration = {
      different: 'value',
    };
    axios.get.mockResolvedValue({ data: alternativeConfiguration });

    // check cached value returned
    const configuration = await getOidcConfig({ getCachedValue: false });
    expect(configuration).toEqual(alternativeConfiguration);
  });
});
