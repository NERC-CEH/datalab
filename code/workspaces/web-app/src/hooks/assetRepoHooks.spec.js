import useShallowSelector from './useShallowSelector';
import assetRepoSelectors from '../selectors/assetRepoSelectors';
import { useAssetRepo, useVisibleAssets } from './assetRepoHooks';

jest.mock('./useShallowSelector');

const publicAsset1 = { name: 'publicAsset1', visible: 'PUBLIC', projects: [], fileLocation: '/public1' };
const publicAsset2 = { name: 'publicAsset2', visible: 'PUBLIC', projects: [] };
const project1Asset = { name: 'project1Asset', visible: 'BY_PROJECT', projects: [{ key: 'project-1', name: 'project 1' }], fileLocation: '/project1' };
const project2Asset = { name: 'project2Asset', visible: 'BY_PROJECT', projects: [{ key: 'project-2', name: 'project 2' }], fileLocation: '/project2' };
const assetRepoState = { value: { assets: [publicAsset1, publicAsset2, project1Asset, project2Asset] } };
useShallowSelector.mockReturnValue(assetRepoState);
beforeEach(() => jest.clearAllMocks());

describe('useAssetRepo', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useAssetRepo();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(assetRepoSelectors.assetRepo);
    expect(hookResult.value.assets).toEqual([project1Asset, project2Asset, publicAsset1, publicAsset2]);
  });
});

describe('useVisibleAssets', () => {
  it('returns visible assets', () => {
    // Act
    const hookResult = useVisibleAssets('project-1');

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(assetRepoSelectors.assetRepo);
    expect(hookResult.value.assets).toEqual([project1Asset, publicAsset1]);
  });
});
