import useShallowSelector from './useShallowSelector';
import projectsSelectors from '../selectors/projectsSelectors';

export default function useCurrentProjectKey() {
  return useShallowSelector(projectsSelectors.currentProject);
}
