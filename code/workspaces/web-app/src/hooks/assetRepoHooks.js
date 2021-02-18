import useShallowSelector from './useShallowSelector';
import assetRepoSelectors from '../selectors/assetRepoSelectors';
import sortByName from '../components/common/sortByName';

export const useAssetRepo = () => useShallowSelector(assetRepoSelectors.assetRepo);

export const useVisibleAssets = (projectKey) => {
  const assetRepo = useAssetRepo();
  const visibleAssets = assetRepo.value.assets
    ? assetRepo.value.assets.filter(asset => (asset.visible === 'PUBLIC' || asset.projects.includes(projectKey)) && asset.fileLocation)
    : [];
  return {
    ...assetRepo,
    value:
    {
      assets: sortByName(visibleAssets),
    },
  };
};
