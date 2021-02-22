import useShallowSelector from './useShallowSelector';
import assetRepoSelectors from '../selectors/assetRepoSelectors';
import sortByName from '../components/common/sortByName';

const useAssetRepoUnsorted = () => useShallowSelector(assetRepoSelectors.assetRepo);

export const useAssetRepo = () => {
  const assetRepo = useAssetRepoUnsorted();
  return {
    ...assetRepo,
    value:
    {
      assets: sortByName(assetRepo.value.assets),
    },
  };
};

const assetVisible = (projectKey, asset) => asset.visible === 'PUBLIC'
  || (asset.projects && asset.projects.filter(project => project.key === projectKey).length > 0);

export const useVisibleAssets = (projectKey) => {
  const assetRepo = useAssetRepoUnsorted();
  const visibleAssets = assetRepo.value.assets
    ? assetRepo.value.assets.filter(asset => assetVisible(projectKey, asset))
    : [];
  return {
    ...assetRepo,
    value:
    {
      assets: sortByName(visibleAssets),
    },
  };
};
