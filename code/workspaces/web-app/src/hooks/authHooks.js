import useShallowSelector from './useShallowSelector';
import authSelectors from '../selectors/authSelectors';

const { currentUserId, currentUserPermissions, currentUserTokens } = authSelectors;

export const useCurrentUserId = () => useShallowSelector(currentUserId);
export const useCurrentUserPermissions = () => useShallowSelector(currentUserPermissions);
export const useCurrentUserTokens = () => useShallowSelector(currentUserTokens);
