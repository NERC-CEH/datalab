import useShallowSelector from './useShallowSelector';
import currentProjectSelectors from '../selectors/currentProjectSelectors';

const { currentProject, currentProjectKey } = currentProjectSelectors;

export const useCurrentProject = () => useShallowSelector(currentProject);
export const useCurrentProjectKey = () => useShallowSelector(currentProjectKey);
