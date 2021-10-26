import useShallowSelector from './useShallowSelector';
import rolesSelectors from '../selectors/rolesSelectors';
import { useRoles } from './rolesHooks';

jest.mock('./useShallowSelector');

beforeEach(() => {
  useShallowSelector.mockReturnValue('expected-value');
});

describe('useRoles', () => {
  it('returns result of shallow selector with correct selector function', () => {
    // Act
    const hookResult = useRoles();

    // Assert
    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(rolesSelectors.roles);
    expect(hookResult).toEqual('expected-value');
  });
});
