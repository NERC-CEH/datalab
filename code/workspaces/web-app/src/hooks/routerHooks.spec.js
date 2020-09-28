import useShallowSelector from './useShallowSelector';
import routerSelectors from '../selectors/routerSelectors';
import { useSearchUrl } from './routerHooks';

jest.mock('./useShallowSelector');
useShallowSelector.mockReturnValue('expected-value');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSearchUrl', () => {
  it('uses shallow selector with correct selector function', () => {
    const currentUserId = useSearchUrl();

    expect(useShallowSelector).toHaveBeenCalledTimes(1);
    expect(useShallowSelector).toHaveBeenCalledWith(routerSelectors.searchUrl);
    expect(currentUserId).toEqual('expected-value');
  });
});
