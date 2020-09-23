import useShallowSelector from './useShallowSelector';
import routerSelectors from '../selectors/routerSelectors';
import { useSearchHash } from './routerHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSearchHash', () => {
  it('uses shallow selector with correct selector function', () => {
    const currentUserId = useSearchHash();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(routerSelectors.searchHash);
    expect(currentUserId).toEqual('expected-value');
  });
});
