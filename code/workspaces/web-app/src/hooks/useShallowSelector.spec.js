import { useSelector, shallowEqual } from 'react-redux';
import useShallowSelector from './useShallowSelector';

jest.mock('react-redux');

describe('useShallowSelector', () => {
  it('passes selector function to useSelector with shallowEqual', () => {
    const selector = jest.fn().mockName('selector-function');
    useShallowSelector(selector);

    expect(useSelector).toHaveBeenCalledTimes(1);
    expect(useSelector).toHaveBeenCalledWith(selector, shallowEqual);
  });

  it('returns the result of useSelector', () => {
    useSelector.mockReturnValue('expected-value');
    expect(useShallowSelector(jest.fn())).toEqual('expected-value');
  });
});
