import useShallowSelector from './useShallowSelector';
import projectSelectors from '../selectors/projectsSelectors';
import useProjectsArray from './useProjectsArray';

jest.mock('./useShallowSelector');
jest.mock('../selectors/projectsSelectors');

describe('useProjectsArray', () => {
  it('returns result of shallow selector with correct selector function', () => {
    useShallowSelector.mockReturnValue('expected-value');
    const currentKey = useProjectsArray();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(projectSelectors.projectArray);
    expect(currentKey).toEqual('expected-value');
  });
});
