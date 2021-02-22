import data from './catalogue_asset_repo_config.json';

export const catalogueAvailable = () => data.catalogue && data.catalogue.available;
export const catalogueServer = () => catalogueAvailable() && data.catalogue.storage.server;
export const catalogueFileLocation = () => catalogueAvailable() && data.catalogue.storage.rootDirectory;

// eslint-disable-next-line import/prefer-default-export
export const assetTypes = () => Object.keys(data.assetRepo.types);
