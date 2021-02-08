import useShallowSelector from './useShallowSelector';
import assetRepoSelectors from '../selectors/assetRepoSelectors';
import { useAssetRepo } from './assetRepoHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

describe('useAssetRepo', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useAssetRepo();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(assetRepoSelectors.assetRepo);
    expect(hookResult).toEqual('expected-value');
  });
});
