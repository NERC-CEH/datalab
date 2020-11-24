import useShallowSelector from './useShallowSelector';
import rolesSelectors from '../selectors/rolesSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useRoles = () => useShallowSelector(rolesSelectors.roles);
