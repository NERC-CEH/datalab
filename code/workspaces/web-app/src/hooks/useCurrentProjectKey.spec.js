import useShallowSelector from './useShallowSelector';
import projectSelectors from '../selectors/projectsSelectors';
import useCurrentProjectKey from './useCurrentProjectKey';

jest.mock('./useShallowSelector');
jest.mock('../selectors/projectsSelectors');

describe('useCurrentProjectKey', () => {
  it('returns result of shallow selector with correct selector function', () => {
    useShallowSelector.mockReturnValue('expected-value');
    const currentKey = useCurrentProjectKey();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(projectSelectors.currentProjectKey);
    expect(currentKey).toEqual('expected-value');
  });
});
