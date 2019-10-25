import useShallowSelector from './useShallowSelector';
import currentProjectSelectors from '../selectors/currentProjectSelectors';
import { useCurrentProject, useCurrentProjectKey } from './currentProjectHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useCurrentProject', () => {
  it('returns result of shallow selector with correct selector function', () => {
    const currentProject = useCurrentProject();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(currentProjectSelectors.currentProject);
    expect(currentProject).toEqual('expected-value');
  });
});

describe('useCurrentProjectKey', () => {
  it('returns result of shallow selector with correct selector function', () => {
    const currentKey = useCurrentProjectKey();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(currentProjectSelectors.currentProjectKey);
    expect(currentKey).toEqual('expected-value');
  });
});
