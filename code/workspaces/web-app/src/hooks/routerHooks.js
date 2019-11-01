import useShallowSelector from './useShallowSelector';
import routerSelectors from '../selectors/routerSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useUrlHash = () => useShallowSelector(routerSelectors.urlHash);
