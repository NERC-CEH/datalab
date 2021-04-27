import useShallowSelector from './useShallowSelector';
import assetRepoSelectors from '../selectors/assetRepoSelectors';
import sortByName from '../components/common/sortByName';
import { PUBLIC } from '../components/assetRepo/assetVisibilities';

const useAssetRepoUnsorted = () => useShallowSelector(assetRepoSelectors.assetRepo);

export const useAssetRepo = () => {
  const assetRepo = useAssetRepoUnsorted();
  return {
    ...assetRepo,
    value:
    {
      ...assetRepo.value,
      assets: sortByName(assetRepo.value.assets),
    },
  };
};

const assetVisible = (projectKey, asset) => asset.fileLocation
  && (asset.visible === PUBLIC
  || (asset.projects && asset.projects.map(project => project.key).includes(projectKey)));

export const useVisibleAssets = (projectKey) => {
  const assetRepo = useAssetRepoUnsorted();
  const visibleAssets = assetRepo.value.assets
    ? assetRepo.value.assets.filter(asset => assetVisible(projectKey, asset))
    : [];
  return {
    ...assetRepo,
    value:
    {
      ...assetRepo.value,
      assets: sortByName(visibleAssets),
    },
  };
};
