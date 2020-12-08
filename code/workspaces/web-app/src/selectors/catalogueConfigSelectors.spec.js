import catalogueConfigSelectors from './catalogueConfigSelectors';

const { catalogueConfig, catalogueAvailable } = catalogueConfigSelectors;

const createState = ({ fetching = false, available = true } = {}) => ({
  catalogueConfig: {
    fetching,
    value: { available },
  },
});

describe('catalogueConfig', () => {
  it('returns the value of catalogue config in provided state', () => {
    const state = createState();
    expect(catalogueConfig(state)).toEqual(state.catalogueConfig);
  });
});

describe('catalogueAvailable', () => {
  it('returns value of fetching from catalogue value', () => {
    [false, true].forEach((fetching) => {
      const state = createState({ fetching });
      expect(catalogueAvailable(state).fetching).toEqual(fetching);
    });
  });

  it('returns value of available from catalogue config as value', () => {
    [false, true].forEach((available) => {
      const state = createState({ available });
      expect(catalogueAvailable(state).value).toEqual(available);
    });
  });

  it('returns available as false if catalogueConfig empty', () => {
    const state = { catalogueConfig: {} };
    expect(catalogueAvailable(state).value).toBe(false);
  });
});
