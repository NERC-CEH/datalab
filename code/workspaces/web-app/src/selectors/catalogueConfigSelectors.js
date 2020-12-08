const selectCatalogueConfig = ({ catalogueConfig }) => catalogueConfig;
const selectCatalogueAvailable = (state) => {
  const catalogueConfig = selectCatalogueConfig(state);
  const available = (catalogueConfig.value && catalogueConfig.value.available) || false;
  return { ...catalogueConfig, value: available };
};

export default {
  catalogueConfig: selectCatalogueConfig,
  catalogueAvailable: selectCatalogueAvailable,
};
