import useShallowSelector from './useShallowSelector';
import otherUserRolesSelectors from '../selectors/otherUserRolesSelectors';
import { useOtherUserRoles } from './otherUserRolesHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

describe('useOtherUserRoles', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useOtherUserRoles();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(otherUserRolesSelectors.otherUserRoles);
    expect(hookResult).toEqual('expected-value');
  });
});
