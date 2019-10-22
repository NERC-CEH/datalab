import useShallowSelector from './useShallowSelector';
import projectsSelectors from '../selectors/projectsSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useProjectsArray = () => useShallowSelector(projectsSelectors.projectArray);
