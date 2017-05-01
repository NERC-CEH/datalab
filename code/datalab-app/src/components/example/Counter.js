import React from 'react';
import { RaisedButton } from 'material-ui';

const Counter = ({ value, increment }) => (
  <div>
    <RaisedButton label={value || 'Click Counter'} primary={true} onClick={increment} />
  </div>
);

export default Counter;
