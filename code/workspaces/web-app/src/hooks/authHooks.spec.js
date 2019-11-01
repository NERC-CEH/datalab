import useShallowSelector from './useShallowSelector';
import authSelectors from '../selectors/authSelectors';
import { useCurrentUserId, useCurrentUserPermissions } from './authHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useCurrentUserId', () => {
  it('uses shallow selector with correct selector function', () => {
    const currentUserId = useCurrentUserId();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(authSelectors.currentUserId);
    expect(currentUserId).toEqual('expected-value');
  });
});

describe('useCurrentUserPermissions', () => {
  it('uses shallow selector with correct selector function', () => {
    const currentUserPermissions = useCurrentUserPermissions();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(authSelectors.currentUserPermissions);
    expect(currentUserPermissions).toEqual('expected-value');
  });
});
