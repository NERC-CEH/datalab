import useShallowSelector from './useShallowSelector';
import catalogueConfigSelectors from '../selectors/catalogueConfigSelectors';

export const useCatalogueConfig = () => useShallowSelector(catalogueConfigSelectors.catalogueConfig);
export const useCatalogueAvailable = () => useShallowSelector(catalogueConfigSelectors.catalogueAvailable);
