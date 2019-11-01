import useShallowSelector from './useShallowSelector';
import projectUsersSelectors from '../selectors/projectUsersSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useProjectUsers = () => useShallowSelector(projectUsersSelectors.projectUsers);
