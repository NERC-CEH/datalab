import catalogueConfigSelectors from '../selectors/catalogueConfigSelectors';
import useShallowSelector from './useShallowSelector';
import { useCatalogueConfig, useCatalogueAvailable } from './catalogueConfigHooks';

jest.mock('./useShallowSelector');

useShallowSelector.mockImplementation(selector => selector());

const catalogueConfigSelectorMock = jest.fn().mockName('catalogueConfigSelector');
catalogueConfigSelectors.catalogueConfig = catalogueConfigSelectorMock;
const catalogueAvailableSelectorMock = jest.fn().mockName('catalogueAvailableSelector');
catalogueConfigSelectors.catalogueAvailable = catalogueAvailableSelectorMock;

describe('useCatalogueConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses catalogueConfig selector as a shallow selector', () => {
    useCatalogueConfig();
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(catalogueConfigSelectorMock);
  });
});

describe('useCatalogueAvailable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses catalogueAvailable selector as a shallow selector', () => {
    useCatalogueAvailable();
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(catalogueAvailableSelectorMock);
  });
});
