import useShallowSelector from './useShallowSelector';
import usersSelectors from '../selectors/usersSelectors';
import sortByName from '../components/common/sortByName';

export const useUsers = () => useShallowSelector(usersSelectors.users);

export const useUsersSortedByName = () => {
  const users = useUsers();
  return {
    ...users,
    value: sortByName(users.value),
  };
};
