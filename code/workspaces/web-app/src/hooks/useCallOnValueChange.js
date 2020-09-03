import { useState } from 'react';

// Call callback when value changes
function useCallOnValueChange(value, callback) {
  const [previousValue, setPreviousValue] = useState(value);
  if (value !== previousValue) {
    setPreviousValue(value);
    callback();
  }
}

export default useCallOnValueChange;
