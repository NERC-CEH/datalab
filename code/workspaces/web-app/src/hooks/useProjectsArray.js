import useShallowSelector from './useShallowSelector';
import projectsSelectors from '../selectors/projectsSelectors';

export default function useProjectsArray() {
  return useShallowSelector(projectsSelectors.projectArray);
}
