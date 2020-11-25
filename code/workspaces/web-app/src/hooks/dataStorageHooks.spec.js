import useShallowSelector from './useShallowSelector';
import dataStorageSelectors from '../selectors/dataStorageSelectors';
import { useDataStorageArray } from './dataStorageHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

describe('useDataStorageArray', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useDataStorageArray();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(dataStorageSelectors.dataStorageArray);
    expect(hookResult).toEqual('expected-value');
  });
});
