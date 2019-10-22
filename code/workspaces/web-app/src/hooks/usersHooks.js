import useShallowSelector from './useShallowSelector';
import usersSelectors from '../selectors/usersSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useUsers = () => useShallowSelector(usersSelectors.users);
