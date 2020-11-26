import useShallowSelector from './useShallowSelector';
import stacksSelectors from '../selectors/stacksSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useStacksArray = () => useShallowSelector(stacksSelectors.stacksArray);
