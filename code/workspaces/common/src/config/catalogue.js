import data from './catalogue_asset_repo_config.json';

// eslint-disable-next-line import/prefer-default-export
export const assetTypes = () => Object.keys(data.assetRepo.types);
