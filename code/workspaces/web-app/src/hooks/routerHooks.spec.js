import useShallowSelector from './useShallowSelector';
import routerSelectors from '../selectors/routerSelectors';
import { useUrlHash } from './routerHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUrlHash', () => {
  it('uses shallow selector with correct selector function', () => {
    const currentUserId = useUrlHash();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(routerSelectors.urlHash);
    expect(currentUserId).toEqual('expected-value');
  });
});
