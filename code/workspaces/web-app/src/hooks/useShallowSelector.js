import { useSelector, shallowEqual } from 'react-redux';

const useShallowSelector = selectorFn => useSelector(selectorFn, shallowEqual);

export default useShallowSelector;
