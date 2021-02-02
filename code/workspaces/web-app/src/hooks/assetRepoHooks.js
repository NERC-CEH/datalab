import useShallowSelector from './useShallowSelector';
import assetRepoSelectors from '../selectors/assetRepoSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useAssetRepo = () => useShallowSelector(assetRepoSelectors.assetRepo);
