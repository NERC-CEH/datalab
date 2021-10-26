import useShallowSelector from './useShallowSelector';
import authSelectors from '../selectors/authSelectors';
import { useCurrentUserId, useCurrentUserPermissions, useCurrentUserTokens } from './authHooks';

jest.mock('./useShallowSelector');

beforeEach(() => {
  jest.clearAllMocks();
  useShallowSelector.mockReturnValue('expected-value');
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

describe('useCurrentUserTokens', () => {
  it('uses shallow selector with correct selector function', () => {
    const currentUserPermissions = useCurrentUserTokens();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(authSelectors.currentUserTokens);
    expect(currentUserPermissions).toEqual('expected-value');
  });
});
