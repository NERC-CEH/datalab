import useShallowSelector from './useShallowSelector';
import otherUserRolesSelectors from '../selectors/otherUserRolesSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useOtherUserRoles = () => useShallowSelector(otherUserRolesSelectors.otherUserRoles);
