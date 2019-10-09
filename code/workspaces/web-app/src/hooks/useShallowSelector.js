import { useSelector, shallowEqual } from 'react-redux';

function useShallowSelector(selectorFn) {
  return useSelector(selectorFn, shallowEqual);
}

export default useShallowSelector;
