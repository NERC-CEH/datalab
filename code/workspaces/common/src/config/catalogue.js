import data from './catalogue_asset_repo_config.json';

export const catalogueAvailable = () => data.catalogue && data.catalogue.available;
export const catalogueServer = () => catalogueAvailable() && data.catalogue.storage.server;
export const catalogueFileLocation = () => catalogueAvailable() && data.catalogue.storage.rootDirectory;
