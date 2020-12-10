import { catalogueConfig } from '../config/catalogue';

export const LOAD_CATALOGUE_CONFIG_ACTION = 'LOAD_CATALOGUE_CONFIG_ACTION';

const loadCatalogueConfig = () => ({
  type: LOAD_CATALOGUE_CONFIG_ACTION,
  payload: catalogueConfig(),
});

export default {
  loadCatalogueConfig,
};
