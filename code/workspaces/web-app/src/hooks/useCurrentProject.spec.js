import useShallowSelector from './useShallowSelector';
import projectSelectors from '../selectors/projectsSelectors';
import useCurrentProject from './useCurrentProject';

jest.mock('./useShallowSelector');
jest.mock('../selectors/projectsSelectors');

describe('useCurrentProjectKey', () => {
  it('returns result of shallow selector with correct selector function', () => {
    useShallowSelector.mockReturnValue('expected-value');
    const currentProject = useCurrentProject();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(projectSelectors.currentProject);
    expect(currentProject).toEqual('expected-value');
  });
});
