import useShallowSelector from './useShallowSelector';
import projectUsersSelectors from '../selectors/projectUsersSelectors';
import { useProjectUsers } from './projectUsersHooks';

jest.mock('./useShallowSelector');

beforeEach(() => {
  jest.clearAllMocks();
  useShallowSelector.mockReturnValue('expected-value');
});

describe('useProjectUsers', () => {
  it('returns result of shallow selector with correct selector function', () => {
    const projectUsers = useProjectUsers();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(projectUsersSelectors.projectUsers);
    expect(projectUsers).toEqual('expected-value');
  });
});
