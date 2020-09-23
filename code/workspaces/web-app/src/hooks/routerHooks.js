import useShallowSelector from './useShallowSelector';
import routerSelectors from '../selectors/routerSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useSearchHash = () => useShallowSelector(routerSelectors.searchHash);
