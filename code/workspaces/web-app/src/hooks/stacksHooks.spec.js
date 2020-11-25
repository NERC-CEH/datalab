import useShallowSelector from './useShallowSelector';
import stacksSelectors from '../selectors/stacksSelectors';
import { useStacksArray } from './stacksHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

describe('useStacksArray', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useStacksArray();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(stacksSelectors.stacksArray);
    expect(hookResult).toEqual('expected-value');
  });
});
