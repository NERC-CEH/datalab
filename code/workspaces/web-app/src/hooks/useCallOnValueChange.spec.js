import { renderHook } from '@testing-library/react-hooks';
import useCallOnValueChange from './useCallOnValueChange';

describe('useCallOnValueChange', () => {
  it('calls callback when input value changes, does not when value is the same', () => {
    const originalValue = 0;
    const callbackMock = jest.fn();

    const { rerender } = renderHook(
      ({ value, callback }) => useCallOnValueChange(value, callback),
      { initialProps: { value: originalValue, callback: callbackMock } },
    );

    // check not called on initial call
    expect(callbackMock.mock.calls.length).toBe(0);

    // check does not call callback when called with original value again
    rerender({ value: originalValue, callback: callbackMock });
    expect(callbackMock.mock.calls.length).toBe(0);

    // check calls callback when value changes
    const newValue = 10;
    rerender({ value: newValue, callback: callbackMock });
    expect(callbackMock.mock.calls.length).toBe(1);

    // check does not call callback when called with new value again
    rerender({ value: newValue, callback: callbackMock });
    expect(callbackMock.mock.calls.length).toBe(1);
  });
});
